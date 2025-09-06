import { ITaskOutput } from "@/@core/domain/entities/task.entity";
import { ITaskRepository } from "@/@core/infrastructure/repositories/tasks/tasks.repository.interface";
import { IUseCase } from "@/@core/interfaces/usecases.interface";

class FindAllTasksUseCase implements IUseCase<null, ITaskOutput[]> {
  private tasksRepository: ITaskRepository;
  constructor(tasksRepository: ITaskRepository) {
    this.tasksRepository = tasksRepository;
  }

  async execute(): Promise<ITaskOutput[]> {
    const tasks = await this.tasksRepository.findAll();
    return tasks.map((task) => task.toJSON());
  }
}

export default FindAllTasksUseCase;
