import { SuggestDailyTasksUseCase } from "../suggest-daily-tasks.usecase";
import { TaskSqliteRepository } from "@/@core/infrastructure/repositories/tasks/sqlite/task.repository";
import RoutineSqliteRepository from "@/@core/infrastructure/repositories/routines/sqlite/routine.repository";
import { PromptSqliteRepository } from "@/@core/infrastructure/repositories/prompts/sqlite/prompt.repository";
import { OpenAIClient } from "@/@core/infrastructure/clients/openai/client.openai";
export function createSuggestDailyTasksUseCase(): SuggestDailyTasksUseCase {
  const taskRepository = new TaskSqliteRepository();
  const routineRepository = new RoutineSqliteRepository();
  const promptRepository = new PromptSqliteRepository();
  const openaiApiKey = process.env.OPENAI_API_KEY;
  if (!openaiApiKey) {
    throw new Error("OPENAI_API_KEY não está configurada");
  }
  const aiClient = new OpenAIClient(
    openaiApiKey,
    process.env.OPENAI_MODEL || "gpt-5",
    0.7
  );
  return new SuggestDailyTasksUseCase(
    taskRepository,
    routineRepository,
    promptRepository,
    aiClient
  );
}
