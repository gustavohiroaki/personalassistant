import { ITaskDb } from "@/entities/ITask";
import TasksPanel from "@/components/templates/TasksPanel";

export default async function TaskList() {
    const data = await fetch('http://localhost:3000/api/tasks', { method: 'GET' })
    const tasks: ITaskDb[] = await data.json()

    return (
        <TasksPanel initialTasks={tasks} />
    );
}
