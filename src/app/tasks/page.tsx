import { ITask } from "@/entities/ITask";
import TasksPanel from "@/components/templates/TasksPanel";

export default async function TaskList() {
    let tasks: ITask[] = [];

    try {
        const response = await fetch(`${process.env.API_URL}/api/tasks`, { method: 'GET' });
        if (!response.ok) {
            throw new Error(`Failed to fetch tasks: ${response.statusText}`);
        }
        tasks = await response.json();
    } catch (error) {
        console.error("Error fetching tasks:", error);
    }

    return (
        <TasksPanel initialTasks={tasks} />
    );
}
