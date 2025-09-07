import { GenerateDayPlanUseCase } from "../generate-day-plan.usecase";
import { TaskSqliteRepository } from "@/@core/infrastructure/repositories/tasks/sqlite/task.repository";
import RoutineSqliteRepository from "@/@core/infrastructure/repositories/routines/sqlite/routine.repository";

export class GenerateDayPlanFactory {
  static create(): GenerateDayPlanUseCase {
    const taskRepository = new TaskSqliteRepository();
    const routineRepository = new RoutineSqliteRepository();

    return new GenerateDayPlanUseCase(taskRepository, routineRepository);
  }
}
