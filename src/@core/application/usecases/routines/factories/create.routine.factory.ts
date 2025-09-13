import CreateRoutineUseCase from "../create.routine";
import RoutineSqliteRepository from "@/@core/infrastructure/repositories/routines/sqlite/routine.repository";
const makeCreateRoutineUseCase = (): CreateRoutineUseCase => {
  const routineRepository = new RoutineSqliteRepository();
  return new CreateRoutineUseCase(routineRepository);
};
export default makeCreateRoutineUseCase;
