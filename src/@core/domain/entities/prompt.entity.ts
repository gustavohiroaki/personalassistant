import { hash } from "crypto";
import { Entity } from "./entity";

export interface IPromptInput {
  systemPrompt?: string;
  prompt: string;
}

export interface IPromptOutput {
  id: string;
  createdAt: string;
  updatedAt?: string;
  prompt: string;
  systemPrompt?: string;
  response?: string;
}

export class Prompt extends Entity {
  id: string;
  createdAt: Date;
  updatedAt?: Date | undefined;
  prompt: string;
  systemPrompt?: string;
  response?: string;

  constructor(input: IPromptInput) {
    super();
    this.id = hash(
      "SHA256",
      `${input.prompt}${input.systemPrompt ? input.systemPrompt : ""}`
    );
    this.createdAt = new Date();
    this.prompt = input.prompt;
    this.systemPrompt = input.systemPrompt;
  }

  toJSON(): IPromptOutput {
    return {
      id: this.id,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt?.toISOString(),
      prompt: this.prompt,
      systemPrompt: this.systemPrompt,
      response: this.response,
    };
  }

  static fromJSON(json: IPromptOutput): Prompt {
    const prompt = new Prompt({
      prompt: json.prompt,
      systemPrompt: json.systemPrompt,
    });
    prompt.id = json.id;
    prompt.createdAt = new Date(json.createdAt);
    prompt.updatedAt = json.updatedAt ? new Date(json.updatedAt) : undefined;
    prompt.response = json.response;
    return prompt;
  }

  setResponse(response: string) {
    this.response = response;
  }
}
