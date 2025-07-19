export interface ITask {
    title: string;
    description: string;
    dueDate: Date;
    priority: 'low' | 'medium' | 'high';
    completed: boolean;
}

export interface ITaskDb extends ITask {
    id: string;
    createdAt: Date;
    updatedAt?: Date;
}