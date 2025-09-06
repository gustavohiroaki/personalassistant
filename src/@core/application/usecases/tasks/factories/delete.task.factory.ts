import DeleteTaskUseCase from "../delete.task";
import { TaskSqliteRepository } from "@/@core/infrastructure/repositories/tasks/sqlite/task.repository";

const makeDeleteTaskUseCase = (): DeleteTaskUseCase => {
  const tasksRepository = new TaskSqliteRepository();
  return new DeleteTaskUseCase(tasksRepository);
};

export default makeDeleteTaskUseCase;
