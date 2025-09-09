import { Entity } from "./entity";

export interface ITaskInput {
  title: string;
  description: string;
  dueDate: Date;
  priority: "low" | "medium" | "high";
  completed?: boolean;
  category?: string; // Categoria da tarefa (ex: "trabalho", "pessoal", "estudos")
}

export interface ITaskOutput {
  id: string;
  createdAt: string;
  updatedAt?: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
  category?: string;
}

export class Task extends Entity {
  id: string;
  createdAt: Date;
  updatedAt?: Date;
  title: string;
  description: string;
  dueDate: Date;
  priority: "low" | "medium" | "high";
  completed: boolean;
  category?: string;

  constructor(input: ITaskInput) {
    super();
    this.id = crypto.randomUUID();
    this.createdAt = new Date();
    this.title = input.title;
    this.description = input.description;
    this.dueDate = input.dueDate;
    this.priority = input.priority;
    this.completed = input.completed ?? false;
    this.category = input.category;
  }

  toJSON(): ITaskOutput {
    return {
      id: this.id,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt?.toISOString(),
      title: this.title,
      description: this.description,
      dueDate: this.dueDate.toISOString(),
      priority: this.priority,
      completed: this.completed,
      category: this.category,
    };
  }

  static fromJSON(json: ITaskOutput): Task {
    const task = new Task({
      title: json.title,
      description: json.description,
      dueDate: new Date(json.dueDate),
      priority: json.priority,
      completed: json.completed,
      category: json.category,
    });
    task.id = json.id;
    task.createdAt = new Date(json.createdAt);
    task.updatedAt = json.updatedAt ? new Date(json.updatedAt) : undefined;
    return task;
  }
}
