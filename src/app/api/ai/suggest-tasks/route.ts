import { NextRequest, NextResponse } from "next/server";
import { SuggestDailyTasksUseCase } from "@/@core/application/usecases/day-plan/suggest-daily-tasks.usecase";
import { TaskSqliteRepository } from "@/@core/infrastructure/repositories/tasks/sqlite/task.repository";
import RoutineSqliteRepository from "@/@core/infrastructure/repositories/routines/sqlite/routine.repository";
import { PromptSqliteRepository } from "@/@core/infrastructure/repositories/prompts/sqlite/prompt.repository";
import { OpenAIClient } from "@/@core/infrastructure/clients/openai/client.openai";
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date");
    const workStartTime = searchParams.get("workStartTime") || "09:00";
    const workEndTime = searchParams.get("workEndTime") || "17:00";
    const wakeUpTime = searchParams.get("wakeUpTime") || "06:00";
    const sleepTime = searchParams.get("sleepTime") || "22:00";
    const focusAreas = searchParams.get("focusAreas")?.split(",") || [];
    const currentEnergy = parseInt(searchParams.get("currentEnergy") || "7");
    const availableTime = parseInt(searchParams.get("availableTime") || "8");
    const targetDate = dateParam ? new Date(dateParam) : new Date();
    if (isNaN(targetDate.getTime())) {
      return NextResponse.json(
        { error: "Data inválida fornecida" },
        { status: 400 }
      );
    }
    const taskRepository = new TaskSqliteRepository();
    const routineRepository = new RoutineSqliteRepository();
    const promptRepository = new PromptSqliteRepository();
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return NextResponse.json(
        { error: "Chave da API OpenAI não configurada" },
        { status: 500 }
      );
    }
    const aiClient = new OpenAIClient(
      openaiApiKey,
      process.env.OPENAI_MODEL || "gpt-5"
    );
    const suggestDailyTasksUseCase = new SuggestDailyTasksUseCase(
      taskRepository,
      routineRepository,
      promptRepository,
      aiClient
    );
    const result = await suggestDailyTasksUseCase.execute({
      targetDate,
      workStartTime,
      workEndTime,
      wakeUpTime,
      sleepTime,
      focusAreas,
      currentEnergy,
      availableTime,
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro ao gerar sugestões de tarefas:", error);
    return NextResponse.json(
      { 
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : "Erro desconhecido"
      },
      { status: 500 }
    );
  }
}
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      targetDate: dateParam,
      workStartTime = "09:00",
      workEndTime = "17:00", 
      wakeUpTime = "06:00",
      sleepTime = "22:00",
      focusAreas = [],
      currentEnergy = 7,
      availableTime = 8
    } = body;
    const targetDate = dateParam ? new Date(dateParam) : new Date();
    if (isNaN(targetDate.getTime())) {
      return NextResponse.json(
        { error: "Data inválida fornecida" },
        { status: 400 }
      );
    }
    const taskRepository = new TaskSqliteRepository();
    const routineRepository = new RoutineSqliteRepository();
    const promptRepository = new PromptSqliteRepository();
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return NextResponse.json(
        { error: "Chave da API OpenAI não configurada" },
        { status: 500 }
      );
    }
    const aiClient = new OpenAIClient(
      openaiApiKey,
      process.env.OPENAI_MODEL || "gpt-5"
    );
    const suggestDailyTasksUseCase = new SuggestDailyTasksUseCase(
      taskRepository,
      routineRepository,
      promptRepository,
      aiClient
    );
    const result = await suggestDailyTasksUseCase.execute({
      targetDate,
      workStartTime,
      workEndTime,
      wakeUpTime,
      sleepTime,
      focusAreas,
      currentEnergy,
      availableTime,
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro ao gerar sugestões de tarefas:", error);
    return NextResponse.json(
      { 
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : "Erro desconhecido"
      },
      { status: 500 }
    );
  }
}
