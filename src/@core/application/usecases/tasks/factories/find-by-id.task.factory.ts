import FindByIdTaskUseCase from "../find-by-id.task";
import { TaskSqliteRepository } from "@/@core/infrastructure/repositories/tasks/sqlite/task.repository";
const makeFindByIdTaskUseCase = (): FindByIdTaskUseCase => {
  const tasksRepository = new TaskSqliteRepository();
  return new FindByIdTaskUseCase(tasksRepository);
};
export default makeFindByIdTaskUseCase;
