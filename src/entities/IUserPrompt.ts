export interface IUserPrompt {
  id: string;
  prompt: string;
}
export type IUserPromptCreate = Omit<IUserPrompt, "id">;
export type IUserPromptUpdate = IUserPromptCreate;
