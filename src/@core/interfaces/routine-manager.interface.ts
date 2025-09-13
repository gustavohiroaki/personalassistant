import {
  IRoutineInput,
  IRoutineOutput,
} from "@/@core/domain/entities/routine.entity";
export interface IRoutineManagerService {
  createRoutine(input: IRoutineInput): Promise<IRoutineOutput>;
  updateRoutine(
    id: string,
    input: Partial<IRoutineInput>
  ): Promise<IRoutineOutput>;
  deleteRoutine(id: string): Promise<boolean>;
  getRoutineById(id: string): Promise<IRoutineOutput | null>;
  getAllRoutines(): Promise<IRoutineOutput[]>;
  activateRoutine(id: string): Promise<boolean>;
  deactivateRoutine(id: string): Promise<boolean>;
  getActiveRoutines(): Promise<IRoutineOutput[]>;
  getInactiveRoutines(): Promise<IRoutineOutput[]>;
  getRoutinesByFrequency(frequency: string): Promise<IRoutineOutput[]>;
  getRoutinesForDate(date: Date): Promise<IRoutineOutput[]>;
  getRoutinesForDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<IRoutineOutput[]>;
  getRoutinesForToday(): Promise<IRoutineOutput[]>;
  getRoutinesForWeek(startDate: Date): Promise<IRoutineOutput[]>;
  getRoutinesForMonth(year: number, month: number): Promise<IRoutineOutput[]>;
  markRoutineAsExecuted(id: string, executionDate: Date): Promise<boolean>;
  getRoutineExecutionHistory(id: string): Promise<Date[]>;
  getOverdueRoutines(currentDate: Date): Promise<IRoutineOutput[]>;
  validateRoutineSchedule(routine: IRoutineInput): Promise<boolean>;
  checkRoutineConflicts(routine: IRoutineInput): Promise<IRoutineOutput[]>;
  getRoutineStatistics(): Promise<{
    total: number;
    active: number;
    inactive: number;
    byFrequency: Record<string, number>;
  }>;
}
