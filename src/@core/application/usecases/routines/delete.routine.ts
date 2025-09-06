import { IRoutineRepository } from "@/@core/infrastructure/repositories/routines/routines.repository.interface";
import { IUseCase } from "@/@core/interfaces/usecases.interface";

class DeleteRoutineUseCase implements IUseCase<string, boolean> {
  private routineRepository: IRoutineRepository;

  constructor(routineRepository: IRoutineRepository) {
    this.routineRepository = routineRepository;
  }

  async execute(id: string): Promise<boolean> {
    const existingRoutine = await this.routineRepository.findById(id);
    if (!existingRoutine) {
      throw new Error("Routine not found");
    }

    return await this.routineRepository.delete(id);
  }
}

export default DeleteRoutineUseCase;
