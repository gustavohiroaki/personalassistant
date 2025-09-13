import makeFindByIdTaskUseCase from "@/@core/application/usecases/tasks/factories/find-by-id.task.factory";
import makeUpdateTaskUseCase from "@/@core/application/usecases/tasks/factories/update.task.factory";
import makeDeleteTaskUseCase from "@/@core/application/usecases/tasks/factories/delete.task.factory";
import { ITaskInput } from "@/@core/domain/entities/task.entity";
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return new Response("Missing task ID", { status: 400 });
  }
  try {
    const task = await makeFindByIdTaskUseCase().execute(id);
    if (!task) {
      return new Response("Task not found", { status: 404 });
    }
    return new Response(JSON.stringify(task), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching task:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const dataToUpdate = (await req.json()) as Partial<ITaskInput>;
  const { id: taskId } = await params;
  if (!taskId || Object.keys(dataToUpdate).length === 0) {
    return new Response("Missing required fields", { status: 400 });
  }
  try {
    await makeUpdateTaskUseCase().execute({ id: taskId, data: dataToUpdate });
    return new Response(
      JSON.stringify({ message: "Task updated successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error updating task:", error);
    if (error instanceof Error && error.message === "Task not found") {
      return new Response(JSON.stringify({ error: "Task not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return new Response("Missing task ID", { status: 400 });
  }
  try {
    await makeDeleteTaskUseCase().execute(id);
    return new Response("Task deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting task:", error);
    if (error instanceof Error && error.message === "Task not found") {
      return new Response("Task not found", { status: 404 });
    }
    return new Response("Internal Server Error", { status: 500 });
  }
}
