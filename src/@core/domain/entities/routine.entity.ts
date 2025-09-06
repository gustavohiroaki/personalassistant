import { randomUUID } from "crypto";
import { Entity } from "./entity";

type TRoutineFrequency =
  | "once"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "custom";

export interface IRoutineInput {
  title: string;
  description?: string;
  frequency: TRoutineFrequency;
  startDate: Date;
  endDate?: Date;
  active?: boolean;
  taskIds?: string[]; // IDs das tarefas associadas
  // Configurações específicas por frequência
  daysOfWeek?: number[]; // Para weekly: [0=Domingo, 1=Segunda, ...]
  dayOfMonth?: number; // Para monthly: dia do mês (1-31)
  daysOfMonth?: number[]; // Para monthly múltiplos dias
  month?: number; // Para yearly: mês (1-12)
  dayOfYear?: number; // Para yearly: dia do ano (1-366)
  customRule?: string; // Para custom: expressão cron ou JSON
}

export interface IRoutineOutput {
  id: string;
  createdAt: string;
  updatedAt?: string;
  title: string;
  description?: string;
  frequency: TRoutineFrequency;
  startDate: string;
  endDate?: string;
  active: boolean;
  taskIds: string[];
  daysOfWeek?: number[];
  dayOfMonth?: number;
  daysOfMonth?: number[];
  month?: number;
  dayOfYear?: number;
  customRule?: string;
}

export class Routine extends Entity {
  id: string;
  createdAt: Date;
  updatedAt?: Date;
  title: string;
  description?: string;
  frequency: TRoutineFrequency;
  startDate: Date;
  endDate?: Date;
  active: boolean;
  taskIds: string[];
  daysOfWeek?: number[];
  dayOfMonth?: number;
  daysOfMonth?: number[];
  month?: number;
  dayOfYear?: number;
  customRule?: string;

  constructor(input: IRoutineInput) {
    super();
    this.id = randomUUID();
    this.createdAt = new Date();
    this.title = input.title;
    this.description = input.description;
    this.frequency = input.frequency;
    this.startDate = input.startDate;
    this.endDate = input.endDate;
    this.active = input.active ?? true;
    this.taskIds = input.taskIds ?? [];
    this.daysOfWeek = input.daysOfWeek;
    this.dayOfMonth = input.dayOfMonth;
    this.daysOfMonth = input.daysOfMonth;
    this.month = input.month;
    this.dayOfYear = input.dayOfYear;
    this.customRule = input.customRule;
  }

  toJSON(): IRoutineOutput {
    return {
      id: this.id,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt?.toISOString(),
      title: this.title,
      description: this.description,
      frequency: this.frequency,
      startDate: this.startDate.toISOString(),
      endDate: this.endDate?.toISOString(),
      active: this.active,
      taskIds: this.taskIds,
      daysOfWeek: this.daysOfWeek,
      dayOfMonth: this.dayOfMonth,
      daysOfMonth: this.daysOfMonth,
      month: this.month,
      dayOfYear: this.dayOfYear,
      customRule: this.customRule,
    };
  }

  static fromJSON(json: IRoutineOutput): Routine {
    const routine = new Routine({
      title: json.title,
      description: json.description,
      frequency: json.frequency,
      startDate: new Date(json.startDate),
      endDate: json.endDate ? new Date(json.endDate) : undefined,
      active: json.active,
      taskIds: json.taskIds,
      daysOfWeek: json.daysOfWeek,
      dayOfMonth: json.dayOfMonth,
      daysOfMonth: json.daysOfMonth,
      month: json.month,
      dayOfYear: json.dayOfYear,
      customRule: json.customRule,
    });
    routine.id = json.id;
    routine.createdAt = new Date(json.createdAt);
    routine.updatedAt = json.updatedAt ? new Date(json.updatedAt) : undefined;
    return routine;
  }

  // Métodos de negócio
  addTask(taskId: string): void {
    if (!this.taskIds.includes(taskId)) {
      this.taskIds.push(taskId);
      this.updatedAt = new Date();
    }
  }

  removeTask(taskId: string): void {
    const index = this.taskIds.indexOf(taskId);
    if (index > -1) {
      this.taskIds.splice(index, 1);
      this.updatedAt = new Date();
    }
  }

  activate(): void {
    this.active = true;
    this.updatedAt = new Date();
  }

  deactivate(): void {
    this.active = false;
    this.updatedAt = new Date();
  }

  setFrequency(
    frequency: TRoutineFrequency,
    options?: {
      daysOfWeek?: number[];
      dayOfMonth?: number;
      daysOfMonth?: number[];
      month?: number;
      dayOfYear?: number;
      customRule?: string;
    }
  ): void {
    this.frequency = frequency;

    // Limpa configurações anteriores
    this.daysOfWeek = undefined;
    this.dayOfMonth = undefined;
    this.daysOfMonth = undefined;
    this.month = undefined;
    this.dayOfYear = undefined;
    this.customRule = undefined;

    // Define configurações específicas
    if (options) {
      this.daysOfWeek = options.daysOfWeek;
      this.dayOfMonth = options.dayOfMonth;
      this.daysOfMonth = options.daysOfMonth;
      this.month = options.month;
      this.dayOfYear = options.dayOfYear;
      this.customRule = options.customRule;
    }

    this.updatedAt = new Date();
  }

  // Validações de negócio
  isActive(): boolean {
    const now = new Date();
    return (
      this.active &&
      now >= this.startDate &&
      (!this.endDate || now <= this.endDate)
    );
  }

  validateFrequencyConfiguration(): boolean {
    switch (this.frequency) {
      case "daily":
      case "once":
        return true;
      case "weekly":
        return this.daysOfWeek !== undefined && this.daysOfWeek.length > 0;
      case "monthly":
        return (
          this.dayOfMonth !== undefined ||
          (this.daysOfMonth !== undefined && this.daysOfMonth.length > 0)
        );
      case "yearly":
        return (
          this.dayOfYear !== undefined ||
          (this.month !== undefined && this.dayOfMonth !== undefined)
        );
      case "custom":
        return this.customRule !== undefined && this.customRule.length > 0;
      default:
        return false;
    }
  }
}
