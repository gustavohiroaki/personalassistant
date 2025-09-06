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
    // Primeiro busca a task existente
    const existingTask = await this.tasksRepository.findById(id);
    if (!existingTask) {
      throw new Error("Task not found");
    }

    // Cria uma nova task com os dados atualizados
    const updatedTaskData: ITaskInput = {
      title: data.title ?? existingTask.title,
      description: data.description ?? existingTask.description,
      dueDate: data.dueDate ? new Date(data.dueDate) : existingTask.dueDate,
      priority: data.priority ?? existingTask.priority,
      completed: data.completed ?? existingTask.completed,
    };

    const updatedTask = new Task(updatedTaskData);
    updatedTask.id = id; // Preserva o ID original
    updatedTask.createdAt = existingTask.createdAt; // Preserva a data de criação
    updatedTask.updatedAt = new Date(); // Define a data de atualização

    return await this.tasksRepository.update(updatedTask);
  }
}

export default UpdateTaskUseCase;
