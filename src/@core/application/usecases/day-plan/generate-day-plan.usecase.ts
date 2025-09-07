import {
  DayPlan,
  IDayPlanSuggestion,
} from "@/@core/domain/aggregates/day-plan.aggregate";
import { Task } from "@/@core/domain/entities/task.entity";
import { Routine } from "@/@core/domain/entities/routine.entity";
import { ITaskRepository } from "@/@core/infrastructure/repositories/tasks/tasks.repository.interface";
import { IRoutineRepository } from "@/@core/infrastructure/repositories/routines/routines.repository.interface";
import { IUseCase } from "@/@core/interfaces/usecases.interface";

export interface IGenerateDayPlanInput {
  date: Date;
  includeAllTasks?: boolean;
  includeActiveRoutines?: boolean;
}

export class GenerateDayPlanUseCase
  implements IUseCase<IGenerateDayPlanInput, IDayPlanSuggestion>
{
  constructor(
    private taskRepository: ITaskRepository,
    private routineRepository: IRoutineRepository
  ) {}

  async execute(input: IGenerateDayPlanInput): Promise<IDayPlanSuggestion> {
    const {
      date,
      includeAllTasks = false,
      includeActiveRoutines = true,
    } = input;

    const allTasks = await this.taskRepository.findAll();

    let tasks: Task[];
    if (includeAllTasks) {
      tasks = allTasks.filter((task) => !task.completed);
    } else {
      const targetDate = date.toDateString();
      tasks = allTasks.filter(
        (task) => !task.completed && task.dueDate.toDateString() === targetDate
      );
    }

    const allRoutines = await this.routineRepository.findAll();

    let routines: Routine[];
    if (includeActiveRoutines) {
      routines = allRoutines.filter(
        (routine) =>
          routine.active && this.shouldRoutineRunOnDate(routine, date)
      );
    } else {
      routines = allRoutines;
    }

    const dayPlan = new DayPlan(date);
    dayPlan.addTasks(tasks);
    dayPlan.addRoutines(routines);

    return dayPlan.createSuggestionFromAIResponse("");
  }

  private shouldRoutineRunOnDate(routine: Routine, date: Date): boolean {
    if (!routine.active) return false;

    const dayOfWeek = date.getDay();

    switch (routine.frequency) {
      case "daily":
        return true;
      case "weekly":
        return routine.daysOfWeek
          ? routine.daysOfWeek.includes(dayOfWeek)
          : true;
      case "monthly":
        if (routine.dayOfMonth) {
          return date.getDate() === routine.dayOfMonth;
        }
        if (routine.daysOfMonth) {
          return routine.daysOfMonth.includes(date.getDate());
        }
        return false;
      case "yearly":
        if (routine.month && routine.dayOfMonth) {
          return (
            date.getMonth() + 1 === routine.month &&
            date.getDate() === routine.dayOfMonth
          );
        }
        return false;
      case "once":
        const startDate = new Date(routine.startDate);
        return date.toDateString() === startDate.toDateString();
      default:
        return false;
    }
  }

  generatePromptForAI(input: IGenerateDayPlanInput): string {
    const dayPlan = new DayPlan(input.date);
    return dayPlan.generatePromptForAI();
  }
}

export default GenerateDayPlanUseCase;
