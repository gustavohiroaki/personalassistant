import { Routine, IRoutineInput } from "@/@core/domain/entities/routine.entity";
import { IRoutineRepository } from "@/@core/infrastructure/repositories/routines/routines.repository.interface";
import { IUseCase } from "@/@core/interfaces/usecases.interface";

interface UpdateRoutineInput {
  id: string;
  data: Partial<IRoutineInput>;
}

class UpdateRoutineUseCase implements IUseCase<UpdateRoutineInput, boolean> {
  private routineRepository: IRoutineRepository;

  constructor(routineRepository: IRoutineRepository) {
    this.routineRepository = routineRepository;
  }

  async execute({ id, data }: UpdateRoutineInput): Promise<boolean> {
    const existingRoutine = await this.routineRepository.findById(id);
    if (!existingRoutine) {
      throw new Error("Routine not found");
    }

    const updatedRoutineData: IRoutineInput = {
      title: data.title ?? existingRoutine.title,
      description: data.description ?? existingRoutine.description,
      category: data.category ?? existingRoutine.category,
      frequency: data.frequency ?? existingRoutine.frequency,
      startDate: data.startDate ?? existingRoutine.startDate,
      endDate: data.endDate ?? existingRoutine.endDate,
      active: data.active ?? existingRoutine.active,
      daysOfWeek: data.daysOfWeek ?? existingRoutine.daysOfWeek,
      dayOfMonth: data.dayOfMonth ?? existingRoutine.dayOfMonth,
      daysOfMonth: data.daysOfMonth ?? existingRoutine.daysOfMonth,
      month: data.month ?? existingRoutine.month,
      dayOfYear: data.dayOfYear ?? existingRoutine.dayOfYear,
      customRule: data.customRule ?? existingRoutine.customRule,
    };

    const updatedRoutine = new Routine(updatedRoutineData);
    updatedRoutine.id = id;
    updatedRoutine.createdAt = existingRoutine.createdAt;
    updatedRoutine.updatedAt = new Date();

    if (!updatedRoutine.validateFrequencyConfiguration()) {
      throw new Error("Invalid frequency configuration");
    }

    return await this.routineRepository.update(updatedRoutine);
  }
}

export default UpdateRoutineUseCase;
