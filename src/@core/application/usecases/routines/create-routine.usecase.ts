import {
  IRoutineInput,
  IRoutineOutput,
  Routine,
} from "@/@core/domain/entities/routine.entity";
import { IRoutineRepository } from "@/@core/infrastructure/repositories/routines/routines.repository.interface";
import { IUseCase } from "@/@core/interfaces/usecases.interface";
export class CreateRoutineUseCase
  implements IUseCase<IRoutineInput, IRoutineOutput>
{
  constructor(private routineRepository: IRoutineRepository) {}
  async execute(input: IRoutineInput): Promise<IRoutineOutput> {
    if (!input.title || input.title.trim().length === 0) {
      throw new Error("Título da rotina é obrigatório");
    }
    if (!input.frequency) {
      throw new Error("Frequência da rotina é obrigatória");
    }
    if (!input.startDate) {
      throw new Error("Data de início da rotina é obrigatória");
    }
    const routine = new Routine(input);
    await this.routineRepository.create(routine);
    return routine.toJSON();
  }
}
