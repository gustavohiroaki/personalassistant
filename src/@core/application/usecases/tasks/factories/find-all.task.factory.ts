import FindAllTasksUseCase from "../find-all.task";
import { TaskSqliteRepository } from "@/@core/infrastructure/repositories/tasks/sqlite/task.repository";
const makeFindAllTasksUseCase = (): FindAllTasksUseCase => {
  const tasksRepository = new TaskSqliteRepository();
  return new FindAllTasksUseCase(tasksRepository);
};
export default makeFindAllTasksUseCase;
