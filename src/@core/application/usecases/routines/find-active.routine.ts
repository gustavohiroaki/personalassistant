import { IRoutineOutput } from "@/@core/domain/entities/routine.entity";
import RoutineSqliteRepository from "@/@core/infrastructure/repositories/routines/sqlite/routine.repository";
import { IUseCase } from "@/@core/interfaces/usecases.interface";
class FindActiveRoutinesUseCase implements IUseCase<null, IRoutineOutput[]> {
  private routineRepository: RoutineSqliteRepository;
  constructor() {
    this.routineRepository = new RoutineSqliteRepository();
  }
  async execute(): Promise<IRoutineOutput[]> {
    const routines = await this.routineRepository.findActiveRoutines();
    return routines
      .filter((routine) => routine.isActive())
      .map((routine) => routine.toJSON());
  }
}
export default FindActiveRoutinesUseCase;
