import {
  IRoutineInput,
  IRoutineOutput,
} from "@/@core/domain/entities/routine.entity";

export interface IRoutineManagerService {
  // CRUD básico
  createRoutine(input: IRoutineInput): Promise<IRoutineOutput>;
  updateRoutine(
    id: string,
    input: Partial<IRoutineInput>
  ): Promise<IRoutineOutput>;
  deleteRoutine(id: string): Promise<boolean>;
  getRoutineById(id: string): Promise<IRoutineOutput | null>;
  getAllRoutines(): Promise<IRoutineOutput[]>;

  // Operações específicas de rotinas
  activateRoutine(id: string): Promise<boolean>;
  deactivateRoutine(id: string): Promise<boolean>;
  getActiveRoutines(): Promise<IRoutineOutput[]>;
  getInactiveRoutines(): Promise<IRoutineOutput[]>;

  // Operações baseadas em frequência
  getRoutinesByFrequency(frequency: string): Promise<IRoutineOutput[]>;
  getRoutinesForDate(date: Date): Promise<IRoutineOutput[]>;
  getRoutinesForDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<IRoutineOutput[]>;

  // Operações de agenda
  getRoutinesForToday(): Promise<IRoutineOutput[]>;
  getRoutinesForWeek(startDate: Date): Promise<IRoutineOutput[]>;
  getRoutinesForMonth(year: number, month: number): Promise<IRoutineOutput[]>;

  // Operações de execução
  markRoutineAsExecuted(id: string, executionDate: Date): Promise<boolean>;
  getRoutineExecutionHistory(id: string): Promise<Date[]>;
  getOverdueRoutines(currentDate: Date): Promise<IRoutineOutput[]>;

  // Operações de validação
  validateRoutineSchedule(routine: IRoutineInput): Promise<boolean>;
  checkRoutineConflicts(routine: IRoutineInput): Promise<IRoutineOutput[]>;

  // Operações de relatório
  getRoutineStatistics(): Promise<{
    total: number;
    active: number;
    inactive: number;
    byFrequency: Record<string, number>;
  }>;
}
