import { Prompt } from "@/@core/domain/entities/prompt.entity";
import { IAIClients } from "@/@core/interfaces/ai-clients.interface";
import OpenAI from "openai";

export class OpenAIClient implements IAIClients {
  model: string;
  temperature?: number;
  client: OpenAI;

  constructor(apikey: string, model: string, temperature?: number) {
    this.model = model;
    this.temperature = temperature;
    this.client = new OpenAI({
      apiKey: apikey,
    });
  }

  async generateResponse(prompt: Prompt): Promise<string> {
    const params = {
      model: this.model,
      input: prompt.prompt,
      ...(prompt.systemPrompt ? { instructions: prompt.systemPrompt } : {}),
    };
    const response = await this.client.responses.create(params);
    return response.output_text;
  }
}
