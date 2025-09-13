import { IPromptInput, Prompt } from "@/@core/domain/entities/prompt.entity";
import { IPromptRepository } from "@/@core/infrastructure/repositories/prompts/prompts.repository.interface";
import { IAIClients } from "@/@core/interfaces/ai-clients.interface";
import { IUseCase } from "@/@core/interfaces/usecases.interface";
export class CreatePromptUseCase implements IUseCase<IPromptInput, string> {
  private aiClient: IAIClients;
  private promptRepository: IPromptRepository;
  constructor(aiClient: IAIClients, promptRepository: IPromptRepository) {
    this.aiClient = aiClient;
    this.promptRepository = promptRepository;
  }
  async execute(input: IPromptInput): Promise<string> {
    const prompt = new Prompt(input);
    const alreadyCreated = await this.promptRepository.findById(prompt.id);
    if (alreadyCreated?.response) {
      return alreadyCreated.response;
    }
    const response = await this.aiClient.generateResponse(prompt);
    prompt.setResponse(response);
    await this.promptRepository.create(prompt);
    return response;
  }
}
