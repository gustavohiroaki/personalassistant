import FindAllRoutinesUseCase from "../find-all.routine";
import RoutineSqliteRepository from "@/@core/infrastructure/repositories/routines/sqlite/routine.repository";
const makeFindAllRoutinesUseCase = (): FindAllRoutinesUseCase => {
  const routineRepository = new RoutineSqliteRepository();
  return new FindAllRoutinesUseCase(routineRepository);
};
export default makeFindAllRoutinesUseCase;
