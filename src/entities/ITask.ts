export interface ITask {
  id?: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: "low" | "medium" | "high";
  category: string;
  completed: boolean;
  createdAt?: Date;
}
export interface ITaskCreate {
  title: string;
  description: string;
  dueDate: Date;
  priority: "low" | "medium" | "high";
  category: string;
  completed?: boolean;
}
export interface ITaskUpdate {
  title?: string;
  description?: string;
  dueDate?: Date;
  priority?: "low" | "medium" | "high";
  category: string;
  completed?: boolean;
}
