import { Prompt } from "@/@core/domain/entities/prompt.entity";
import { IPromptRepository } from "../prompts.repository.interface";
import db from "@/@core/infrastructure/database/sqlite-connection";
export class PromptSqliteRepository implements IPromptRepository {
  async create(entity: Prompt): Promise<boolean> {
    await db("prompts").insert(entity);
    return true;
  }
  async findById(id: string): Promise<Prompt | null> {
    const result = await db("prompts").select().where("id", id).first();
    return result || null;
  }
  async findAll(): Promise<Prompt[]> {
    const results = await db("prompts").select();
    return results || [];
  }
  async update(entity: Prompt): Promise<boolean> {
    await db("prompts").update(entity).where("id", entity.id);
    return true;
  }
  async delete(id: string): Promise<boolean> {
    await db("prompts").delete().where("id", id);
    return true;
  }
}
