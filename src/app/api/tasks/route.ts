import { ITask } from "@/entities/ITask";
import { get, post } from "../_repositories/task";

export async function POST(req: Request) {
    const body = await req.json() as ITask;

    if (!body.title || !body.description || !body.dueDate || !body.priority) {
        return new Response("Missing required fields", { status: 400 });
    }

    const task: ITask = {
        title: body.title,
        description: body.description,
        dueDate: body.dueDate,
        priority: body.priority as 'low' | 'medium' | 'high',
        completed: body.completed || false
    };

    try {
        await post(task);
        return new Response("Task created successfully", { status: 201 });
    } catch (error) {
        console.error("Error creating task:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}

export async function GET() {
    try {
        const tasks = await get();
        return new Response(JSON.stringify(tasks), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}