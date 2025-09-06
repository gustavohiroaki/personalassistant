import { PromptSqliteRepository } from "@/@core/infrastructure/repositories/prompts/sqlite/prompt.repository";
import { CreatePromptUseCase } from "../create.prompt";
import { OpenAIClient } from "@/@core/infrastructure/clients/openai/client.openai";

export const makeCreatePromptUseCase = (): CreatePromptUseCase => {
  const aiClient = new OpenAIClient(
    process.env.OPENAI_API_KEY || "",
    "gpt-5-nano"
  );
  const promptRepository = new PromptSqliteRepository();
  return new CreatePromptUseCase(aiClient, promptRepository);
};
