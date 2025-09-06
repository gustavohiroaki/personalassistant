import {
  ITaskInput,
  ITaskOutput,
  Task,
} from "@/@core/domain/entities/task.entity";
import { ITaskRepository } from "@/@core/infrastructure/repositories/tasks/tasks.repository.interface";
import { IUseCase } from "@/@core/interfaces/usecases.interface";

class CreateTaskUseCase implements IUseCase<ITaskInput, ITaskOutput> {
  private tasksRepository: ITaskRepository;
  constructor(tasksRepository: ITaskRepository) {
    this.tasksRepository = tasksRepository;
  }

  async execute(input: ITaskInput): Promise<ITaskOutput> {
    const task = new Task(input);
    await this.tasksRepository.create(task);
    return task.toJSON();
  }
}

export default CreateTaskUseCase;
