import UpdateRoutineUseCase from "../update.routine";
import RoutineSqliteRepository from "@/@core/infrastructure/repositories/routines/sqlite/routine.repository";

const makeUpdateRoutineUseCase = (): UpdateRoutineUseCase => {
  const routineRepository = new RoutineSqliteRepository();
  return new UpdateRoutineUseCase(routineRepository);
};

export default makeUpdateRoutineUseCase;
