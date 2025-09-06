import { IRoutineOutput } from "@/@core/domain/entities/routine.entity";
import { IRoutineRepository } from "@/@core/infrastructure/repositories/routines/routines.repository.interface";
import { IUseCase } from "@/@core/interfaces/usecases.interface";

class FindAllRoutinesUseCase implements IUseCase<null, IRoutineOutput[]> {
  private routineRepository: IRoutineRepository;
  
  constructor(routineRepository: IRoutineRepository) {
    this.routineRepository = routineRepository;
  }

  async execute(): Promise<IRoutineOutput[]> {
    const routines = await this.routineRepository.findAll();
    return routines.map((routine) => routine.toJSON());
  }
}

export default FindAllRoutinesUseCase;
