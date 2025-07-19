import { ITaskDb } from "@/entities/ITask";

export default async function TaskList() {
    const data = await fetch('http://localhost:3000/api/tasks', { method: 'GET' })
    const tasks: ITaskDb[] = await data.json()
    console.log(tasks)
    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center py-10">
            <div className="grid grid-cols-2 gap-2">
                {tasks.map(task => (
                    <div className="bg-gray-800 border-1 border-gray-700 rounded-lg p-3 h-40 overflow-y-scroll scrollbar" key={task.id}>
                        <h1>{task.title}</h1>
                        <p>{task.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
