import { IRoutineInput } from "@/@core/domain/entities/routine.entity";
import makeCreateRoutineUseCase from "@/@core/application/usecases/routines/factories/create.routine.factory";
import makeFindAllRoutinesUseCase from "@/@core/application/usecases/routines/factories/find-all.routine.factory";

export async function POST(req: Request) {
  const body = (await req.json()) as IRoutineInput;

  if (!body.title || !body.frequency || !body.startDate) {
    return new Response("Missing required fields", { status: 400 });
  }

  const routine: IRoutineInput = {
    title: body.title,
    description: body.description,
    category: body.category,
    frequency: body.frequency as
      | "once"
      | "daily"
      | "weekly"
      | "monthly"
      | "yearly"
      | "custom",
    startDate: new Date(body.startDate),
    endDate: body.endDate ? new Date(body.endDate) : undefined,
    active: body.active ?? true,
    daysOfWeek: body.daysOfWeek,
    dayOfMonth: body.dayOfMonth,
    daysOfMonth: body.daysOfMonth,
    month: body.month,
    dayOfYear: body.dayOfYear,
    customRule: body.customRule,
  };

  try {
    await makeCreateRoutineUseCase().execute(routine);
    return new Response("Routine created successfully", { status: 201 });
  } catch (error) {
    console.error("Error creating routine:", error);
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return new Response(message, { status: 500 });
  }
}

export async function GET() {
  try {
    const routines = await makeFindAllRoutinesUseCase().execute();
    return new Response(JSON.stringify(routines), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching routines:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
