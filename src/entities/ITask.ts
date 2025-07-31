export interface ITask {
    title: string;
    description: string;
    dueDate: Date;
    priority: 'low' | 'medium' | 'high';
    completed: boolean;
}

export interface ITaskDb {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    priority: 'low' | 'medium' | 'high';
    completed: boolean;
    createdAt: string;
    updatedAt?: string;
}

export interface ITaskUpdate {
    title?: string;
    description?: string;
    dueDate?: string;
    priority?: 'low' | 'medium' | 'high';
    completed?: boolean;
}