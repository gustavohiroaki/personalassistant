import {
  IRoutineInput,
  IRoutineOutput,
  Routine,
} from "@/@core/domain/entities/routine.entity";
import { IRoutineRepository } from "@/@core/infrastructure/repositories/routines/routines.repository.interface";
import { IUseCase } from "@/@core/interfaces/usecases.interface";

export interface IUpdateRoutineInput {
  id: string;
  updates: Partial<IRoutineInput>;
}

export class UpdateRoutineUseCase
  implements IUseCase<IUpdateRoutineInput, IRoutineOutput>
{
  constructor(private routineRepository: IRoutineRepository) {}

  async execute(input: IUpdateRoutineInput): Promise<IRoutineOutput> {
    const { id, updates } = input;

    const existingRoutine = await this.routineRepository.findById(id);
    if (!existingRoutine) {
      throw new Error(`Rotina com ID ${id} não encontrada`);
    }

    // Aplicar atualizações
    const updatedData: IRoutineInput = {
      title: updates.title ?? existingRoutine.title,
      description: updates.description ?? existingRoutine.description,
      frequency: updates.frequency ?? existingRoutine.frequency,
      startDate: updates.startDate ?? existingRoutine.startDate,
      endDate: updates.endDate ?? existingRoutine.endDate,
      active: updates.active ?? existingRoutine.active,
      daysOfWeek: updates.daysOfWeek ?? existingRoutine.daysOfWeek,
      dayOfMonth: updates.dayOfMonth ?? existingRoutine.dayOfMonth,
      daysOfMonth: updates.daysOfMonth ?? existingRoutine.daysOfMonth,
      month: updates.month ?? existingRoutine.month,
      dayOfYear: updates.dayOfYear ?? existingRoutine.dayOfYear,
      customRule: updates.customRule ?? existingRoutine.customRule,
    };

    const updatedRoutine = new Routine(updatedData);
    updatedRoutine.id = id;
    updatedRoutine.createdAt = existingRoutine.createdAt;
    updatedRoutine.updatedAt = new Date();

    await this.routineRepository.update(updatedRoutine);
    return updatedRoutine.toJSON();
  }
}
