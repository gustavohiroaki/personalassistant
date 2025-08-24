import { ITask, ITaskCreate, ITaskUpdate } from "@/entities/ITask";
import { IRepository } from "../interfaces/IRepository";
import Database from "../database/Database";

export default class TaskRepository implements IRepository<ITaskCreate, ITaskUpdate, ITask> {
    private database: Database
    constructor(database: Database) {
        this.database = database
    }

    async create(task: ITaskCreate): Promise<ITask> {
        return this.database.create(task)
    }

    async find(findParams: object): Promise<ITask[]> {
        return this.database.find(findParams);
    }

    async findById(id: string): Promise<ITask | null> {
        const tasks = await this.database.find({ id });
        return tasks.length > 0 ? tasks[0] : null;
    }

    async update(id: string, task: ITaskUpdate): Promise<ITask | null> {
        const existingTask = await this.findById(id);
        if (!existingTask) {
            return null;
        }
        const updatedTask = { ...existingTask, ...task };
        return this.database.update(id, updatedTask);
    }

    async delete(id: string): Promise<boolean> {
        const existingTask = await this.findById(id);
        if (!existingTask) {
            return false;
        }
        return this.database.remove(id);
    }
}