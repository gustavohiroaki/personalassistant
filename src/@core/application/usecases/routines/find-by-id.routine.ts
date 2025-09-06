import { IRoutineOutput } from "@/@core/domain/entities/routine.entity";
import { IRoutineRepository } from "@/@core/infrastructure/repositories/routines/routines.repository.interface";
import { IUseCase } from "@/@core/interfaces/usecases.interface";

class FindByIdRoutineUseCase implements IUseCase<string, IRoutineOutput | null> {
  private routineRepository: IRoutineRepository;
  
  constructor(routineRepository: IRoutineRepository) {
    this.routineRepository = routineRepository;
  }

  async execute(id: string): Promise<IRoutineOutput | null> {
    const routine = await this.routineRepository.findById(id);
    return routine ? routine.toJSON() : null;
  }
}

export default FindByIdRoutineUseCase;
