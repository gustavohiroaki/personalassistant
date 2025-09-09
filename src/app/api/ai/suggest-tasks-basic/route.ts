import { NextRequest, NextResponse } from "next/server";
import { TaskSqliteRepository } from "@/@core/infrastructure/repositories/tasks/sqlite/task.repository";
import RoutineSqliteRepository from "@/@core/infrastructure/repositories/routines/sqlite/routine.repository";
import { Task } from "@/@core/domain/entities/task.entity";
import { Routine } from "@/@core/domain/entities/routine.entity";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date");
    const date = dateParam ? new Date(dateParam) : new Date();

    // Inicializar repositórios
    const taskRepository = new TaskSqliteRepository();
    const routineRepository = new RoutineSqliteRepository();
    
    // Buscar dados
    const allTasks = await taskRepository.findAll();
    const allRoutines = await routineRepository.findAll();
    
    // Filtrar tarefas relevantes
    const relevantTasks = allTasks.filter(task => !task.completed);
    const activeRoutines = allRoutines.filter(routine => routine.active);

    // Criar um plano básico sem IA
    const fallbackPlan = {
      date: date.toISOString(),
      summary: {
        totalTasks: relevantTasks.length,
        totalRoutines: activeRoutines.length,
        highPriorityTasks: relevantTasks.filter(t => t.priority === "high").length,
        estimatedWorkHours: Math.max(relevantTasks.length, activeRoutines.length),
      },
      hourlyPlan: generateBasicHourlyPlan(relevantTasks, activeRoutines),
      tips: [
        "Comece pelas tarefas mais importantes",
        "Faça pausas regulares para manter a produtividade",
        "Mantenha-se hidratado ao longo do dia",
        "Revise seus objetivos periodicamente"
      ],
      motivationalMessage: "Hoje é um novo dia cheio de oportunidades! Você tem tudo o que precisa para ser produtivo e alcançar seus objetivos."
    };

    return NextResponse.json(fallbackPlan);
  } catch (error) {
    console.error("Erro ao gerar plano básico:", error);
    return NextResponse.json(
      { 
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : "Erro desconhecido"
      },
      { status: 500 }
    );
  }
}

function generateBasicHourlyPlan(tasks: Task[], routines: Routine[]) {
  const hourlyPlan = [];
  let currentHour = 9;
  let taskIndex = 0;
  let routineIndex = 0;

  while (currentHour < 18 && (taskIndex < tasks.length || routineIndex < routines.length)) {
    const timeSlot = `${currentHour.toString().padStart(2, "0")}:00 - ${(currentHour + 1).toString().padStart(2, "0")}:00`;
    const activities = [];

    // Adicionar rotinas de manhã
    if (currentHour <= 10 && routineIndex < routines.length) {
      const routine = routines[routineIndex];
      activities.push({
        type: "routine",
        title: routine.title,
        description: routine.description || "Rotina diária",
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
    if (currentHour === 12) {
      activities.push({
        type: "break",
        title: "Almoço",
        description: "Pausa para refeição",
        estimatedDuration: 60,
        category: "descanso"
      });
    } else if (currentHour === 15) {
      activities.push({
        type: "break",
        title: "Pausa para lanche",
        description: "Pequena pausa para recarregar",
        estimatedDuration: 15,
        category: "descanso"
      });
    }

    if (activities.length > 0) {
      hourlyPlan.push({ timeSlot, activities });
    }

    currentHour++;
  }

  // Se não há atividades suficientes, adicionar algumas sugestões
  if (hourlyPlan.length === 0) {
    hourlyPlan.push({
      timeSlot: "09:00 - 10:00",
      activities: [{
        type: "suggestion",
        title: "Planejar o dia",
        description: "Revisar objetivos e definir prioridades",
        estimatedDuration: 30,
        category: "planejamento"
      }]
    });
    
    hourlyPlan.push({
      timeSlot: "10:00 - 11:00",
      activities: [{
        type: "suggestion",
        title: "Trabalho focado",
        description: "Dedique-se às tarefas mais importantes",
        estimatedDuration: 60,
        category: "trabalho"
      }]
    });
  }

  return hourlyPlan;
}
