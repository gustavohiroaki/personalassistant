import { Task } from "@/@core/domain/entities/task.entity";
import { Routine } from "@/@core/domain/entities/routine.entity";
import { Prompt } from "@/@core/domain/entities/prompt.entity";
import { ITaskRepository } from "@/@core/infrastructure/repositories/tasks/tasks.repository.interface";
import { IRoutineRepository } from "@/@core/infrastructure/repositories/routines/routines.repository.interface";
import { IPromptRepository } from "@/@core/infrastructure/repositories/prompts/prompts.repository.interface";
import { IAIClients } from "@/@core/interfaces/ai-clients.interface";
import { IUseCase } from "@/@core/interfaces/usecases.interface";
interface UserPreferences {
  workStartHour: number;
  workEndHour: number;
  includeBreaks: boolean;
  breakDuration: number;
  maxTasksPerHour: number;
}
interface HourlyPlanSlot {
  timeSlot: string;
  activities: Array<{ 
    id?: string;
    type: "task" | "routine" | "break" | "suggestion";
    title: string;
    description?: string;
    priority?: "low" | "medium" | "high";
    estimatedDuration: number;
    category?: string;
  }>;
}
interface AIResponse {
  hourlyPlan?: HourlyPlanSlot[];
  tips?: string[];
  motivationalMessage?: string;
}
interface UserPrompt {
  content?: string;
  prompt?: string;
}
interface ISuggestDailyTasksInput {
  workStartTime?: string; 
  workEndTime?: string; 
  wakeUpTime?: string; 
  sleepTime?: string; 
  focusAreas?: string[];
  currentEnergy?: number; 
  availableTime?: number; 
  targetDate?: Date; 
}
interface IScheduleConfig {
  hasWorkRoutine: boolean;
  workStartTime?: string;
  workEndTime?: string;
  wakeUpTime: string;
  sleepTime: string;
  workTasks: Task[];
  personalTasks: Task[];
  workRoutines: Routine[];
  nonWorkRoutines: Routine[];
  focusAreas: string[];
  currentEnergy: number;
  availableTime: number;
}
export interface ISuggestDailyTasksOutput {
  date: string;
  summary: {
    totalTasks: number;
    totalRoutines: number;
    highPriorityTasks: number;
    estimatedWorkHours: number;
  };
  hourlyPlan: Array<{ 
    timeSlot: string; 
    activities: Array<{ 
      id?: string;
      type: "task" | "routine" | "break" | "suggestion";
      title: string;
      description?: string;
      priority?: "low" | "medium" | "high";
      estimatedDuration: number; 
      category?: string;
    }>;
  }>;
  tips: string[];
  motivationalMessage: string;
}
export class SuggestDailyTasksUseCase implements IUseCase<ISuggestDailyTasksInput, ISuggestDailyTasksOutput> {
  constructor(
    private taskRepository: ITaskRepository,
    private routineRepository: IRoutineRepository,
    private promptRepository: IPromptRepository,
    private aiClient: IAIClients
  ) {}
  async execute(input: ISuggestDailyTasksInput): Promise<ISuggestDailyTasksOutput> {
    const {
      targetDate,
      workStartTime,
      workEndTime,
      wakeUpTime = "06:00",
      sleepTime = "22:00",
      focusAreas = [],
      currentEnergy = 7,
      availableTime = 8
    } = input;
    const date = targetDate || new Date();
    const allTasks = await this.taskRepository.findAll();
    const allRoutines = await this.routineRepository.findAll();
    const userPrompts = await this.promptRepository.findAll();
    const relevantTasks = this.filterRelevantTasks(allTasks, date);
    const activeRoutines = this.filterActiveRoutines(allRoutines, date);
    const hasWorkRoutine = !!(workStartTime && workEndTime);
    const effectiveWorkStart = workStartTime;
    const effectiveWorkEnd = workEndTime;
    const { workTasks, personalTasks } = this.categorizeTasks(relevantTasks);
    const nonWorkRoutines = activeRoutines; 
    const userContext = this.buildUserContext(userPrompts);
    const scheduleConfig = {
      hasWorkRoutine,
      workStartTime: effectiveWorkStart,
      workEndTime: effectiveWorkEnd,
      wakeUpTime,
      sleepTime,
      workTasks,
      personalTasks,
      workRoutines: [], 
      nonWorkRoutines,
      focusAreas,
      currentEnergy,
      availableTime
    };
    const aiPrompt = this.generateIntelligentAIPrompt(scheduleConfig, date, userContext);
    const prompt = new Prompt({
      prompt: aiPrompt,
      systemPrompt: this.getSystemPrompt(),
    });
    try {
      const aiResponse = await this.aiClient.generateResponse(prompt);
      const parsedResponse = JSON.parse(aiResponse);
      return this.formatOutput(parsedResponse, relevantTasks, activeRoutines, date);
    } catch (error) {
      console.error("Erro ao obter sugestão da IA:", error);
      const fallbackPrefs = {
        workStartHour: scheduleConfig.workStartTime ? parseInt(scheduleConfig.workStartTime.split(':')[0]) : 9,
        workEndHour: scheduleConfig.workEndTime ? parseInt(scheduleConfig.workEndTime.split(':')[0]) : 17,
        includeBreaks: true,
        breakDuration: 15,
        maxTasksPerHour: 2,
      };
      return this.generateFallbackPlan([...scheduleConfig.workTasks, ...scheduleConfig.personalTasks], [...scheduleConfig.workRoutines, ...scheduleConfig.nonWorkRoutines], date, fallbackPrefs);
    }
  }
  private filterRelevantTasks(tasks: Task[], date: Date): Task[] {
    const today = new Date(date);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tasks.filter(task => {
      if (task.completed) return false;
      if (task.dueDate <= today) return true;
      const threeDaysFromNow = new Date(today);
      threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
      return task.dueDate <= threeDaysFromNow;
    }).sort((a, b) => {
      if (a.dueDate.getTime() !== b.dueDate.getTime()) {
        return a.dueDate.getTime() - b.dueDate.getTime();
      }
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return a.createdAt.getTime() - b.createdAt.getTime();
    });
  }
  private categorizeTasks(tasks: Task[]): { workTasks: Task[]; personalTasks: Task[] } {
    const workTasks: Task[] = [];
    const personalTasks: Task[] = [];
    tasks.forEach(task => {
      if (task.category === 'trabalho') {
        workTasks.push(task);
      } else {
        personalTasks.push(task);
      }
    });
    return { workTasks, personalTasks };
  }
  private filterActiveRoutines(routines: Routine[], date: Date): Routine[] {
    return routines.filter(routine => {
      if (!routine.active) return false;
      return this.shouldRoutineRunOnDate(routine, date);
    });
  }
  private shouldRoutineRunOnDate(routine: Routine, date: Date): boolean {
    const dayOfWeek = date.getDay();
    const dayOfMonth = date.getDate();
    const month = date.getMonth() + 1;
    switch (routine.frequency) {
      case "daily":
        return true;
      case "weekly":
        return routine.daysOfWeek ? routine.daysOfWeek.includes(dayOfWeek) : false;
      case "monthly":
        if (routine.dayOfMonth) return dayOfMonth === routine.dayOfMonth;
        if (routine.daysOfMonth) return routine.daysOfMonth.includes(dayOfMonth);
        return false;
      case "yearly":
        if (routine.month && routine.dayOfMonth) {
          return month === routine.month && dayOfMonth === routine.dayOfMonth;
        }
        return false;
      case "once":
        return date.toDateString() === routine.startDate.toDateString();
      default:
        return false;
    }
  }
  private buildUserContext(prompts: UserPrompt[]): string {
    if (prompts.length === 0) return "Usuário sem contexto específico definido.";
    return prompts.map(p => p.content || p.prompt).join(" ");
  }
  private generateIntelligentAIPrompt(
    scheduleConfig: IScheduleConfig,
    date: Date,
    userContext: string
  ): string {
    const {
      hasWorkRoutine,
      workStartTime,
      workEndTime,
      wakeUpTime,
      sleepTime,
      workTasks,
      personalTasks,
      workRoutines,
      nonWorkRoutines,
      focusAreas,
      currentEnergy,
      availableTime
    } = scheduleConfig;
    const dateStr = date.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    let prompt = `Você é um especialista em produtividade e gestão de tempo. Crie um plano detalhado para ${dateStr}.\n\nCONTEXTO DO USUÁRIO:\n${userContext}\n\nCONFIGURAÇÃO DO DIA:\n- Horário de acordar: ${wakeUpTime}\n- Horário de dormir: ${sleepTime}\n- Possui rotina de trabalho: ${hasWorkRoutine ? "SIM" : "NÃO"}`;
    if (hasWorkRoutine) {
      prompt += `\n- Horário de trabalho: ${workStartTime} às ${workEndTime}\n\nREGRAS PRIORITÁRIAS PARA DIA COM TRABALHO:\n1. TRABALHO TEM PRIORIDADE MÁXIMA - ocupa o horário ${workStartTime} às ${workEndTime}\n2. Tarefas de trabalho DEVEM ser agendadas APENAS no horário de trabalho\n3. Tarefas pessoais DEVEM ser agendadas FORA do horário de trabalho\n4. Rotinas não-trabalho DEVEM ser agendadas fora do horário de trabalho\n5. Use o período ${wakeUpTime} até ${workStartTime} para atividades matinais\n6. Use o período ${workEndTime} até ${sleepTime} para atividades pessoais/lazer\n\nTAREFAS DE TRABALHO (${workTasks.length}) - APENAS no horário ${workStartTime}-${workEndTime}:`;
      workTasks.forEach((task: Task, idx: number) => {
        prompt += `\n${idx + 1}. [${task.priority.toUpperCase()}] ${task.title}\n   Descrição: ${task.description}\n   Vencimento: ${task.dueDate.toLocaleDateString("pt-BR")}`;
      });
      prompt += `\n\nTAREFAS PESSOAIS (${personalTasks.length}) - APENAS FORA do horário ${workStartTime}-${workEndTime}:`;
      personalTasks.forEach((task: Task, idx: number) => {
        prompt += `\n${idx + 1}. [${task.priority.toUpperCase()}] ${task.title}\n   Descrição: ${task.description}\n   Vencimento: ${task.dueDate.toLocaleDateString("pt-BR")}`;
      });
      if (workRoutines.length > 0) {
        prompt += `\n\nROTINAS DE TRABALHO (${workRoutines.length}) - no horário ${workStartTime}-${workEndTime}:`;
        workRoutines.forEach((routine: Routine, idx: number) => {
          prompt += `\n${idx + 1}. ${routine.title} - ${routine.description || "Sem descrição"}`;
        });
      }
      if (nonWorkRoutines.length > 0) {
        prompt += `\n\nROTINAS PESSOAIS (${nonWorkRoutines.length}) - FORA do horário ${workStartTime}-${workEndTime}:`;
        nonWorkRoutines.forEach((routine: Routine, idx: number) => {
          prompt += `\n${idx + 1}. ${routine.title} - ${routine.description || "Sem descrição"}`;
        });
      }
    } else {
      prompt += `\n\nREGRAS PARA DIA SEM TRABALHO:\n1. Atividades podem ser distribuídas livremente entre ${wakeUpTime} e ${sleepTime}\n2. Priorize tarefas de alta importância nos horários de maior energia\n3. Distribua atividades de forma equilibrada\n\nTODAS AS TAREFAS (${workTasks.concat(personalTasks).length}):`;
      [...workTasks, ...personalTasks].forEach((task, idx) => {
        prompt += `\n${idx + 1}. [${task.priority.toUpperCase()}] ${task.title}\n   Descrição: ${task.description}\n   Vencimento: ${task.dueDate.toLocaleDateString("pt-BR")}`;
      });
      if ([...workRoutines, ...nonWorkRoutines].length > 0) {
        prompt += `\n\nROTINAS ATIVAS (${[...workRoutines, ...nonWorkRoutines].length}):`;
        [...workRoutines, ...nonWorkRoutines].forEach((routine, idx) => {
          prompt += `\n${idx + 1}. ${routine.title} - ${routine.description || "Sem descrição"}`;
        });
      }
    }
    prompt += `\n\nCONFIGURAÇÕES ADICIONAIS:\n- Áreas de foco: ${focusAreas.join(", ") || "Nenhuma específica"}\n- Energia atual: ${currentEnergy}/10\n- Tempo disponível: ${availableTime} horas\n\nINSTRUÇÕES FINAIS:\n${hasWorkRoutine ? 
  `- OBRIGATÓRIO: Tarefas de trabalho APENAS entre ${workStartTime} e ${workEndTime}\n- OBRIGATÓRIO: Tarefas pessoais APENAS fora do horário ${workStartTime}-${workEndTime}\n- Horário ${wakeUpTime}-${workStartTime}: atividades matinais/preparação\n- Horário ${workEndTime}-${sleepTime}: atividades pessoais/relaxamento` :
  `- Distribua atividades entre ${wakeUpTime} e ${sleepTime}\n- Considere picos de energia ao longo do dia`
}
- Analise a 'Descrição' de cada tarefa e rotina para entender o contexto e a complexidade. Use essa informação para decidir se a atividade é viável para o dia e para estimar o tempo necessário.
- Você não precisa incluir todas as tarefas e rotinas listadas. Selecione as mais relevantes e que se encaixam de forma realista no dia do usuário.
- Inclua pausas estratégicas
- Forneça dicas específicas e mensagem motivacional

Responda APENAS com um JSON válido seguindo esta estrutura:
{
  "hourlyPlan": [
    {
      "timeSlot": "07:00 - 08:00",
      "activities": [
        {
          "type": "routine|task|break|personal",
          "title": "Nome da atividade",
          "description": "Descrição detalhada",
          "priority": "high|medium|low",
          "estimatedDuration": 60,
          "category": "trabalho|pessoal|rotina|pausa"
        }
      ]
    }
  ],
  "tips": ["Dica específica 1", "Dica específica 2"],
  "motivationalMessage": "Mensagem motivacional personalizada"
}`;
    return prompt;
  }
  private getSystemPrompt(): string {
    return `Você é um assistente especialista em produtividade e gestão de tempo.\n\nREGRAS IMPORTANTES:\n- Responda APENAS com JSON válido, sem texto adicional\n- Não use markdown, comentários ou explicações\n- RESPEITE RIGOROSAMENTE o horário de trabalho especificado pelo usuário\n- NÃO sugira tarefas de trabalho fora do horário especificado\n- Distribua tarefas de alta prioridade preferencialmente pela manhã (dentro do horário)\n- Inclua pausas regulares para manter a energia\n- Seja realista com estimativas de tempo\n- Adapte sugestões ao contexto e perfil do usuário\n- Use linguagem motivadora mas profissional\n- Considere o equilíbrio entre trabalho e bem-estar\n- Os timeSlots devem estar DENTRO do horário de trabalho especificado`;
  }
  private formatOutput(
    aiResponse: AIResponse, 
    tasks: Task[], 
    routines: Routine[], 
    date: Date
  ): ISuggestDailyTasksOutput {
    const highPriorityTasks = tasks.filter(t => t.priority === "high").length;
    const totalActivities = aiResponse.hourlyPlan?.reduce(
      (acc: number, slot: HourlyPlanSlot) => acc + (slot.activities?.length || 0), 0
    ) || 0;
    return {
      date: date.toISOString(),
      summary: {
        totalTasks: tasks.length,
        totalRoutines: routines.length,
        highPriorityTasks,
        estimatedWorkHours: Math.round(totalActivities * 0.75), 
      },
      hourlyPlan: aiResponse.hourlyPlan || [],
      tips: aiResponse.tips || [
        "Comece pelas tarefas mais importantes",
        "Faça pausas regulares",
        "Mantenha-se hidratado"
      ],
      motivationalMessage: aiResponse.motivationalMessage || 
        "Você é capaz de realizar grandes coisas hoje. Foque no progresso, não na perfeição!"
    };
  }
  private generateFallbackPlan(
    tasks: Task[], 
    routines: Routine[], 
    date: Date, 
    prefs: UserPreferences
  ): ISuggestDailyTasksOutput {
    const hourlyPlan: HourlyPlanSlot[] = [];
    let currentHour = prefs.workStartHour;
    let taskIndex = 0;
    let routineIndex = 0;
    while (currentHour < prefs.workEndHour && (taskIndex < tasks.length || routineIndex < routines.length)) {
      const timeSlot = `${currentHour.toString().padStart(2, "0")}:00 - ${(currentHour + 1).toString().padStart(2, "0")}:00`;
      const activities: HourlyPlanSlot['activities'] = [];
      if (currentHour <= 10 && routineIndex < routines.length) {
        const routine = routines[routineIndex];
        activities.push({
          type: "routine",
          title: routine.title,
          description: routine.description,
          estimatedDuration: 30,
          category: "rotina"
        });
        routineIndex++;
      }
      if (taskIndex < tasks.length) {
        const task = tasks[taskIndex];
        activities.push({
          id: task.id,
          type: "task",
          title: task.title,
          description: task.description,
          priority: task.priority,
          estimatedDuration: 60,
          category: "trabalho"
        });
        taskIndex++;
      }
      if (prefs.includeBreaks && currentHour % 2 === 0) {
        activities.push({
          type: "break",
          title: "Pausa",
          description: "Momento para descanso e recuperação",
          estimatedDuration: prefs.breakDuration,
          category: "descanso"
        });
      }
      if (activities.length > 0) {
        hourlyPlan.push({ timeSlot, activities });
      }
      currentHour++;
    }
    return {
      date: date.toISOString(),
      summary: {
        totalTasks: tasks.length,
        totalRoutines: routines.length,
        highPriorityTasks: tasks.filter(t => t.priority === "high").length,
        estimatedWorkHours: hourlyPlan.length,
      },
      hourlyPlan,
      tips: [
        "Priorize as tarefas mais importantes pela manhã",
        "Faça pausas regulares para manter a produtividade",
        "Mantenha-se hidratado e alimente-se bem"
      ],
      motivationalMessage: "Cada pequeno passo te leva mais perto dos seus objetivos. Você consegue!"
    };
  }
}
