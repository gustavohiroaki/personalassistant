import makeFindByIdRoutineUseCase from "@/@core/application/usecases/routines/factories/find-by-id.routine.factory";
import makeUpdateRoutineUseCase from "@/@core/application/usecases/routines/factories/update.routine.factory";
import makeDeleteRoutineUseCase from "@/@core/application/usecases/routines/factories/delete.routine.factory";
import { IRoutineInput } from "@/@core/domain/entities/routine.entity";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  if (!id) {
    return new Response("Missing routine ID", { status: 400 });
  }

  try {
    const routine = await makeFindByIdRoutineUseCase().execute(id);
    
    if (!routine) {
      return new Response("Routine not found", { status: 404 });
    }

    return new Response(JSON.stringify(routine), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching routine:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const dataToUpdate = (await req.json()) as Partial<IRoutineInput>;
  const { id: routineId } = await params;
  
  if (!routineId || Object.keys(dataToUpdate).length === 0) {
    return new Response("Missing required fields", { status: 400 });
  }

  try {
    // Converte datas se presentes
    if (dataToUpdate.startDate) {
      dataToUpdate.startDate = new Date(dataToUpdate.startDate);
    }
    if (dataToUpdate.endDate) {
      dataToUpdate.endDate = new Date(dataToUpdate.endDate);
    }

    await makeUpdateRoutineUseCase().execute({ id: routineId, data: dataToUpdate });
    return new Response(
      JSON.stringify({ message: "Routine updated successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error updating routine:", error);
    
    if (error instanceof Error && error.message === "Routine not found") {
      return new Response(JSON.stringify({ error: "Routine not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return new Response(JSON.stringify({ error: message }), {
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
    return new Response("Missing routine ID", { status: 400 });
  }

  try {
    await makeDeleteRoutineUseCase().execute(id);
    return new Response("Routine deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting routine:", error);
    
    if (error instanceof Error && error.message === "Routine not found") {
      return new Response("Routine not found", { status: 404 });
    }
    
    return new Response("Internal Server Error", { status: 500 });
  }
}
