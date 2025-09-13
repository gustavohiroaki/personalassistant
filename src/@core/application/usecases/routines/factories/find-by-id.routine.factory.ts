import FindByIdRoutineUseCase from "../find-by-id.routine";
import RoutineSqliteRepository from "@/@core/infrastructure/repositories/routines/sqlite/routine.repository";
const makeFindByIdRoutineUseCase = (): FindByIdRoutineUseCase => {
  const routineRepository = new RoutineSqliteRepository();
  return new FindByIdRoutineUseCase(routineRepository);
};
export default makeFindByIdRoutineUseCase;
