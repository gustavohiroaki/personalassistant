import { ITask, ITaskCreate, ITaskUpdate } from "@/entities/ITask";
import { IRepository } from "../interfaces/IRepository";
import Database from "../database/Database";

export default class TaskRepository
  implements IRepository<ITaskCreate, ITaskUpdate, ITask>
{
  private database: Database;
  private table: string;
  constructor(database: Database) {
    this.database = database;
    this.table = "tasks";
  }

  async create(task: ITaskCreate): Promise<ITask> {
    return (await this.database.create(this.table, {
      ...task,
      createdAt: new Date().toISOString(),
    })) as ITask;
  }

  async find(findParams: object): Promise<ITask[]> {
    return (await this.database.find(this.table, findParams)) as ITask[];
  }

  async findById(id: string): Promise<ITask | null> {
    const tasks = (await this.database.find(this.table, { id })) as ITask[];
    return tasks.length > 0 ? tasks[0] : null;
  }

  async update(id: string, task: ITaskUpdate): Promise<ITask | null> {
    const existingTask = await this.findById(id);
    if (!existingTask) {
      return null;
    }
    const updatedTask = { ...existingTask, ...task };
    return (await this.database.update(
      this.table,
      id,
      updatedTask
    )) as ITask | null;
  }

  async delete(id: string): Promise<boolean> {
    const existingTask = await this.findById(id);
    if (!existingTask) {
      return false;
    }
    return this.database.remove(this.table, id);
  }
}
