import { Routine, IRoutineInput } from "@/@core/domain/entities/routine.entity";
import { IRoutineRepository } from "@/@core/infrastructure/repositories/routines/routines.repository.interface";
import { IUseCase } from "@/@core/interfaces/usecases.interface";
class CreateRoutineUseCase implements IUseCase<IRoutineInput, boolean> {
  private routineRepository: IRoutineRepository;
  constructor(routineRepository: IRoutineRepository) {
    this.routineRepository = routineRepository;
  }
  async execute(input: IRoutineInput): Promise<boolean> {
    const routine = new Routine(input);
    if (!routine.validateFrequencyConfiguration()) {
      throw new Error("Invalid frequency configuration");
    }
    return await this.routineRepository.create(routine);
  }
}
export default CreateRoutineUseCase;
