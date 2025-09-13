import { Task, ITaskInput } from "@/@core/domain/entities/task.entity";
import { ITaskRepository } from "@/@core/infrastructure/repositories/tasks/tasks.repository.interface";
import { IUseCase } from "@/@core/interfaces/usecases.interface";
interface UpdateTaskInput {
  id: string;
  data: Partial<ITaskInput>;
}
class UpdateTaskUseCase implements IUseCase<UpdateTaskInput, boolean> {
  private tasksRepository: ITaskRepository;
  constructor(tasksRepository: ITaskRepository) {
    this.tasksRepository = tasksRepository;
  }
  async execute({ id, data }: UpdateTaskInput): Promise<boolean> {
    const existingTask = await this.tasksRepository.findById(id);
    if (!existingTask) {
      throw new Error("Task not found");
    }
    const updatedTaskData: ITaskInput = {
      title: data.title ?? existingTask.title,
      description: data.description ?? existingTask.description,
      dueDate: data.dueDate ? new Date(data.dueDate) : existingTask.dueDate,
      priority: data.priority ?? existingTask.priority,
      completed: data.completed ?? existingTask.completed,
      category: data.category ?? existingTask.category,
    };
    const updatedTask = new Task(updatedTaskData);
    updatedTask.id = id; 
    updatedTask.createdAt = existingTask.createdAt; 
    updatedTask.updatedAt = new Date(); 
    return await this.tasksRepository.update(updatedTask);
  }
}
export default UpdateTaskUseCase;
