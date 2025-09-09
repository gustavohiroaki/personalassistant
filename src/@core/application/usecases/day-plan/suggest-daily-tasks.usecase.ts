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
  workStartTime?: string; // Formato HH:mm
  workEndTime?: string; // Formato HH:mm
  wakeUpTime?: string; // Horário de acordar
  sleepTime?: string; // Horário de dormir
  focusAreas?: string[];
  currentEnergy?: number; // 1-10
  availableTime?: number; // horas disponíveis
  targetDate?: Date; // Data para sugestões (padrão: hoje)
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
    timeSlot: string; // "09:00 - 10:00"
    activities: Array<{
      id?: string;
      type: "task" | "routine" | "break" | "suggestion";
      title: string;
      description?: string;
      priority?: "low" | "medium" | "high";
      estimatedDuration: number; // em minutos
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
    
    // Buscar todas as tarefas e rotinas
    const allTasks = await this.taskRepository.findAll();
    const allRoutines = await this.routineRepository.findAll();
    const userPrompts = await this.promptRepository.findAll();
    
    // Filtrar tarefas e rotinas relevantes para o dia
    const relevantTasks = this.filterRelevantTasks(allTasks, date);
    const activeRoutines = this.filterActiveRoutines(allRoutines, date);
    
    // Sem rotinas de trabalho específicas, usar apenas os horários fornecidos
    const hasWorkRoutine = !!(workStartTime && workEndTime);
    
    // Usar horários fornecidos pelo usuário
    const effectiveWorkStart = workStartTime;
    const effectiveWorkEnd = workEndTime;
    
    // Separar tarefas por categoria
    const { workTasks, personalTasks } = this.categorizeTasks(relevantTasks);
    const nonWorkRoutines = activeRoutines; // Todas as rotinas são não-trabalho agora
    
    // Construir contexto do usuário
    const userContext = this.buildUserContext(userPrompts);
    
    // Gerar configurações para IA
    const scheduleConfig = {
      hasWorkRoutine,
      workStartTime: effectiveWorkStart,
      workEndTime: effectiveWorkEnd,
      wakeUpTime,
      sleepTime,
      workTasks,
      personalTasks,
      workRoutines: [], // Sem rotinas de trabalho específicas
      nonWorkRoutines,
      focusAreas,
      currentEnergy,
      availableTime
    };
    
    // Gerar prompt inteligente baseado na lógica de trabalho
    const aiPrompt = this.generateIntelligentAIPrompt(scheduleConfig, date, userContext);
    
    // Obter sugestão da IA
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
      // Fallback para plano básico
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
      
      // Tarefas vencidas ou que vencem hoje
      if (task.dueDate <= today) return true;
      
      // Tarefas que vencem em breve (próximos 3 dias)
      const threeDaysFromNow = new Date(today);
      threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
      
      return task.dueDate <= threeDaysFromNow;
    }).sort((a, b) => {
      // Priorizar por: vencimento -> prioridade -> criação
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
    // Construir contexto do usuário baseado nos prompts salvos
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

    let prompt = `Você é um especialista em produtividade e gestão de tempo. Crie um plano detalhado para ${dateStr}.

CONTEXTO DO USUÁRIO:
${userContext}

CONFIGURAÇÃO DO DIA:
- Horário de acordar: ${wakeUpTime}
- Horário de dormir: ${sleepTime}
- Possui rotina de trabalho: ${hasWorkRoutine ? "SIM" : "NÃO"}`;

    if (hasWorkRoutine) {
      prompt += `
- Horário de trabalho: ${workStartTime} às ${workEndTime}

REGRAS PRIORITÁRIAS PARA DIA COM TRABALHO:
1. TRABALHO TEM PRIORIDADE MÁXIMA - ocupa o horário ${workStartTime} às ${workEndTime}
2. Tarefas de trabalho DEVEM ser agendadas APENAS no horário de trabalho
3. Tarefas pessoais DEVEM ser agendadas FORA do horário de trabalho
4. Rotinas não-trabalho DEVEM ser agendadas fora do horário de trabalho
5. Use o período ${wakeUpTime} até ${workStartTime} para atividades matinais
6. Use o período ${workEndTime} até ${sleepTime} para atividades pessoais/lazer

TAREFAS DE TRABALHO (${workTasks.length}) - APENAS no horário ${workStartTime}-${workEndTime}:`;
      
      workTasks.forEach((task: Task, idx: number) => {
        prompt += `\n${idx + 1}. [${task.priority.toUpperCase()}] ${task.title}
   Descrição: ${task.description}
   Vencimento: ${task.dueDate.toLocaleDateString("pt-BR")}`;
      });

      prompt += `\n\nTAREFAS PESSOAIS (${personalTasks.length}) - APENAS FORA do horário ${workStartTime}-${workEndTime}:`;
      
      personalTasks.forEach((task: Task, idx: number) => {
        prompt += `\n${idx + 1}. [${task.priority.toUpperCase()}] ${task.title}
   Descrição: ${task.description}
   Vencimento: ${task.dueDate.toLocaleDateString("pt-BR")}`;
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
      prompt += `

REGRAS PARA DIA SEM TRABALHO:
1. Atividades podem ser distribuídas livremente entre ${wakeUpTime} e ${sleepTime}
2. Priorize tarefas de alta importância nos horários de maior energia
3. Distribua atividades de forma equilibrada

TODAS AS TAREFAS (${workTasks.concat(personalTasks).length}):`;
      
      [...workTasks, ...personalTasks].forEach((task, idx) => {
        prompt += `\n${idx + 1}. [${task.priority.toUpperCase()}] ${task.title}
   Descrição: ${task.description}
   Vencimento: ${task.dueDate.toLocaleDateString("pt-BR")}`;
      });

      if ([...workRoutines, ...nonWorkRoutines].length > 0) {
        prompt += `\n\nROTINAS ATIVAS (${[...workRoutines, ...nonWorkRoutines].length}):`;
        [...workRoutines, ...nonWorkRoutines].forEach((routine, idx) => {
          prompt += `\n${idx + 1}. ${routine.title} - ${routine.description || "Sem descrição"}`;
        });
      }
    }

    prompt += `

CONFIGURAÇÕES ADICIONAIS:
- Áreas de foco: ${focusAreas.join(", ") || "Nenhuma específica"}
- Energia atual: ${currentEnergy}/10
- Tempo disponível: ${availableTime} horas

INSTRUÇÕES FINAIS:
${hasWorkRoutine ? 
  `- OBRIGATÓRIO: Tarefas de trabalho APENAS entre ${workStartTime} e ${workEndTime}
- OBRIGATÓRIO: Tarefas pessoais APENAS fora do horário ${workStartTime}-${workEndTime}
- Horário ${wakeUpTime}-${workStartTime}: atividades matinais/preparação
- Horário ${workEndTime}-${sleepTime}: atividades pessoais/relaxamento` :
  `- Distribua atividades entre ${wakeUpTime} e ${sleepTime}
- Considere picos de energia ao longo do dia`
}
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
    return `Você é um assistente especialista em produtividade e gestão de tempo.

REGRAS IMPORTANTES:
- Responda APENAS com JSON válido, sem texto adicional
- Não use markdown, comentários ou explicações
- RESPEITE RIGOROSAMENTE o horário de trabalho especificado pelo usuário
- NÃO sugira tarefas de trabalho fora do horário especificado
- Distribua tarefas de alta prioridade preferencialmente pela manhã (dentro do horário)
- Inclua pausas regulares para manter a energia
- Seja realista com estimativas de tempo
- Adapte sugestões ao contexto e perfil do usuário
- Use linguagem motivadora mas profissional
- Considere o equilíbrio entre trabalho e bem-estar
- Os timeSlots devem estar DENTRO do horário de trabalho especificado`;
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
        estimatedWorkHours: Math.round(totalActivities * 0.75), // Estimativa
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

      // Adicionar rotinas de manhã
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

      // Adicionar tarefas
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

      // Adicionar pausa se necessário
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
