import CreateTaskUseCase from "../create.task";
import { TaskSqliteRepository } from "@/@core/infrastructure/repositories/tasks/sqlite/task.repository";

const makeCreateTaskUseCase = (): CreateTaskUseCase => {
  const tasksRepository = new TaskSqliteRepository();
  return new CreateTaskUseCase(tasksRepository);
};

export default makeCreateTaskUseCase;
