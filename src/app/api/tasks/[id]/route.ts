import repositories from "@/backend/repositories";
import { ITaskUpdate } from "@/entities/ITask";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const result = await repositories.task.find({ id });
        return new Response(JSON.stringify(result), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (error) {
        console.error("Error updating task:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const dataToUpdate = await req.json() as ITaskUpdate;
    const { id: taskId } = await params;
    if (!taskId || Object.keys(dataToUpdate).length === 0) {
        return new Response("Missing required fields", { status: 400 });
    }

    try {
        await repositories.task.update(taskId, dataToUpdate);
        return new Response(JSON.stringify({ message: "Task updated successfully" }), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (error) {
        console.error("Error updating task:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    if (!id) {
        return new Response("Missing task ID", { status: 400 });
    }

    try {
        await repositories.task.delete(id);
        return new Response("Task deleted successfully", { status: 200 });
    } catch (error) {
        console.error("Error deleting task:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}