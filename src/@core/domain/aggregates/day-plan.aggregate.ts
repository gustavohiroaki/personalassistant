import { Task } from "../entities/task.entity";
import { Routine } from "../entities/routine.entity";
export interface IHourlyPlan {
  hour: string;
  activities: Array<{
    type: "task" | "routine" | "break" | "suggestion";
    title: string;
    description?: string;
    duration?: number; 
    priority?: "low" | "medium" | "high";
  }>;
}
export interface IDayPlanSuggestion {
  date: string;
  totalTasks: number;
  totalRoutines: number;
  hourlyPlan: IHourlyPlan[];
}
export class DayPlan {
  private date: Date;
  private tasks: Task[];
  private routines: Routine[];
  constructor(date: Date, tasks: Task[] = [], routines: Routine[] = []) {
    this.date = date;
    this.tasks = tasks;
    this.routines = routines;
  }
  addTask(task: Task): void {
    if (!this.tasks.find((t) => t.id === task.id)) {
      this.tasks.push(task);
    }
  }
  addRoutine(routine: Routine): void {
    if (!this.routines.find((r) => r.id === routine.id)) {
      this.routines.push(routine);
    }
  }
  addTasks(tasks: Task[]): void {
    tasks.forEach((task) => this.addTask(task));
  }
  addRoutines(routines: Routine[]): void {
    routines.forEach((routine) => this.addRoutine(routine));
  }
  getTasks(): Task[] {
    return this.tasks;
  }
  getRoutines(): Routine[] {
    return this.routines;
  }
  getDate(): Date {
    return this.date;
  }
  generatePromptForAI(): string {
    const taskList = this.tasks.map((task) => ({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate.toISOString(),
      completed: task.completed,
    }));
    const routineList = this.routines.map((routine) => ({
      title: routine.title,
      description: routine.description,
      frequency: routine.frequency,
      active: routine.active,
    }));
    return `Organize um plano detalhado para o dia ${this.date.toLocaleDateString(
      "pt-BR"
    )}.
Tenho as seguintes tarefas pendentes:
${JSON.stringify(taskList, null, 2)}
E as seguintes rotinas ativas:
${JSON.stringify(routineList, null, 2)}
Por favor, organize um cronograma hora a hora das 06:00 às 23:00, distribuindo as tarefas e rotinas de forma equilibrada. 
Inclua pausas e sugestões de atividades quando necessário.
Responda APENAS com um JSON válido seguindo esta estrutura:
{
  "date": "${this.date.toISOString()}",
  "totalTasks": ${this.tasks.length},
  "totalRoutines": ${this.routines.length},
  "hourlyPlan": [
    {
      "hour": "06:00",
      "activities": [
        {
          "type": "routine",
          "title": "Nome da atividade",
          "description": "Descrição opcional",
          "duration": 60,
          "priority": "medium"
        }
      ]
    }
  ]
}`;
  }
  createSuggestionFromAIResponse(aiResponse: string): IDayPlanSuggestion {
    try {
      const parsed = JSON.parse(aiResponse);
      return {
        date: parsed.date || this.date.toISOString(),
        totalTasks: parsed.totalTasks || this.tasks.length,
        totalRoutines: parsed.totalRoutines || this.routines.length,
        hourlyPlan: parsed.hourlyPlan || [],
      };
    } catch {
      return this.generateBasicPlan();
    }
  }
  private generateBasicPlan(): IDayPlanSuggestion {
    const hourlyPlan: IHourlyPlan[] = [];
    let currentHour = 6;
    let taskIndex = 0;
    let routineIndex = 0;
    while (currentHour <= 23) {
      const hour = `${currentHour.toString().padStart(2, "0")}:00`;
      const activities: IHourlyPlan["activities"] = [];
      if (
        currentHour >= 6 &&
        currentHour <= 9 &&
        routineIndex < this.routines.length
      ) {
        const routine = this.routines[routineIndex];
        activities.push({
          type: "routine",
          title: routine.title,
          description: routine.description,
          duration: 60,
        });
        routineIndex++;
      }
      else if (
        currentHour >= 9 &&
        currentHour <= 18 &&
        taskIndex < this.tasks.length
      ) {
        const task = this.tasks[taskIndex];
        activities.push({
          type: "task",
          title: task.title,
          description: task.description,
          duration: 90,
          priority: task.priority,
        });
        taskIndex++;
      }
      else if (currentHour === 12) {
        activities.push({
          type: "break",
          title: "Almoço",
          description: "Pausa para refeição",
          duration: 60,
        });
      } else if (currentHour === 15) {
        activities.push({
          type: "break",
          title: "Pausa para lanche",
          description: "Pequena pausa",
          duration: 30,
        });
      } else {
        activities.push({
          type: "suggestion",
          title: "Tempo livre",
          description: "Período disponível para atividades pessoais",
          duration: 60,
        });
      }
      hourlyPlan.push({ hour, activities });
      currentHour++;
    }
    return {
      date: this.date.toISOString(),
      totalTasks: this.tasks.length,
      totalRoutines: this.routines.length,
      hourlyPlan,
    };
  }
}
