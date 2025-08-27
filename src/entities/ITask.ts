// src/entities/ITask.ts
export interface ITask {
  id?: string; // opcional para criação
  title: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Para criação (sem id e createdAt)
export type ITaskCreate = Omit<ITask, "id" | "createdAt | updatedAt">;

// Para atualização (parcial)
export type ITaskUpdate = Partial<Omit<ITask, "createdAt" | "updatedAt">>;
