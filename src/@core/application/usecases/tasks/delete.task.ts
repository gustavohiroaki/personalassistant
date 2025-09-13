import { ITaskRepository } from "@/@core/infrastructure/repositories/tasks/tasks.repository.interface";
import { IUseCase } from "@/@core/interfaces/usecases.interface";
class DeleteTaskUseCase implements IUseCase<string, boolean> {
  private tasksRepository: ITaskRepository;
  constructor(tasksRepository: ITaskRepository) {
    this.tasksRepository = tasksRepository;
  }
  async execute(id: string): Promise<boolean> {
    const existingTask = await this.tasksRepository.findById(id);
    if (!existingTask) {
      throw new Error("Task not found");
    }
    return await this.tasksRepository.delete(id);
  }
}
export default DeleteTaskUseCase;
