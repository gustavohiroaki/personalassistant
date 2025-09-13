import { ITaskOutput } from "@/@core/domain/entities/task.entity";
import { ITaskRepository } from "@/@core/infrastructure/repositories/tasks/tasks.repository.interface";
import { IUseCase } from "@/@core/interfaces/usecases.interface";
class FindByIdTaskUseCase implements IUseCase<string, ITaskOutput | null> {
  private tasksRepository: ITaskRepository;
  constructor(tasksRepository: ITaskRepository) {
    this.tasksRepository = tasksRepository;
  }
  async execute(id: string): Promise<ITaskOutput | null> {
    const task = await this.tasksRepository.findById(id);
    return task ? task.toJSON() : null;
  }
}
export default FindByIdTaskUseCase;
