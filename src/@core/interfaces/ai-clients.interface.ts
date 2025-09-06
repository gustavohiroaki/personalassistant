import { Prompt } from "../domain/entities/prompt.entity";

export interface IAIClients {
  model: string;
  temperature?: number;
  generateResponse(prompt: Prompt): Promise<string>;
}
