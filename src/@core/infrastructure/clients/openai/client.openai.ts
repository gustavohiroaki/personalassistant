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
    const messages = [
      ...(prompt.systemPrompt ? [{ role: "system" as const, content: prompt.systemPrompt }] : []),
      { role: "user" as const, content: prompt.prompt }
    ];
    const requestConfig: {
      model: string;
      messages: { role: "system" | "user"; content: string }[];
      temperature?: number;
    } = {
      model: this.model,
      messages,
    };
    if (this.temperature !== undefined && this.model !== "gpt-4o-mini" && !this.model.includes("nano")) {
      requestConfig.temperature = this.temperature;
    }
    const response = await this.client.chat.completions.create(requestConfig);
    return response.choices[0]?.message?.content || "";
  }
}
