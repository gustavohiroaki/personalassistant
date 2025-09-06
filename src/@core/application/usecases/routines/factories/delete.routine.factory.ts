import DeleteRoutineUseCase from "../delete.routine";
import RoutineSqliteRepository from "@/@core/infrastructure/repositories/routines/sqlite/routine.repository";

const makeDeleteRoutineUseCase = (): DeleteRoutineUseCase => {
  const routineRepository = new RoutineSqliteRepository();
  return new DeleteRoutineUseCase(routineRepository);
};

export default makeDeleteRoutineUseCase;
