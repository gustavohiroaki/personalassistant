import { Task } from "@/@core/domain/entities/task.entity";
import { IRepository } from "@/@core/domain/repositories/repository";

export type ITaskRepository = IRepository<Task>
