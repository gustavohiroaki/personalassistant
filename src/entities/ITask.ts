// src/entities/ITask.ts
export interface ITask {
    id?: string; // opcional para criação
    title: string;
    description: string;
    dueDate: Date;
    priority: 'low' | 'medium' | 'high';
    completed: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

// Para criação (sem id e createdAt)
export type ITaskCreate = Omit<ITask, 'id' | 'createdAt'>;

// Para atualização (parcial)
export type ITaskUpdate = Partial<Omit<ITask, 'createdAt' | 'updatedAt'>>;