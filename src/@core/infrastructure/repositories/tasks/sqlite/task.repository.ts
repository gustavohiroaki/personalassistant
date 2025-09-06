import { Task } from "@/@core/domain/entities/task.entity";
import db from "../../../database/sqlite-connection";
import { ITaskRepository } from "../tasks.repository.interface";

export class TaskSqliteRepository implements ITaskRepository {
  async create(entity: Task): Promise<boolean> {
    await db("tasks").insert(entity.toJSON());
    return true;
  }

  async findAll(): Promise<Task[]> {
    const tasks = await db("tasks").select("*");
    return tasks.map((task) => Task.fromJSON(task));
  }

  async findById(id: string): Promise<Task | null> {
    const task = await db("tasks").where({ id }).first();
    if (!task) {
      return null;
    }
    return Task.fromJSON(task);
  }

  async update(entity: Task): Promise<boolean> {
    await db("tasks").where({ id: entity.id }).update(entity.toJSON());
    return true;
  }

  async delete(id: string): Promise<boolean> {
    await db("tasks").where({ id }).delete();
    return true;
  }
}
