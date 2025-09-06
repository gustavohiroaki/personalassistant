import UpdateTaskUseCase from "../update.task";
import { TaskSqliteRepository } from "@/@core/infrastructure/repositories/tasks/sqlite/task.repository";

const makeUpdateTaskUseCase = (): UpdateTaskUseCase => {
  const tasksRepository = new TaskSqliteRepository();
  return new UpdateTaskUseCase(tasksRepository);
};

export default makeUpdateTaskUseCase;
