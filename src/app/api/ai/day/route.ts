import { NextResponse } from "next/server";
import { createSuggestDailyTasksUseCase } from "@/@core/application/usecases/day-plan/factories/suggest-daily-tasks.factory";
export async function GET() {
  try {
    const suggestDailyTasksUseCase = createSuggestDailyTasksUseCase();
    const result = await suggestDailyTasksUseCase.execute({
      targetDate: new Date(),
      workStartTime: "09:00",
      workEndTime: "18:00",
      wakeUpTime: "06:00",
      sleepTime: "22:00",
      focusAreas: ["trabalho", "produtividade"],
      currentEnergy: 7,
      availableTime: 8,
    });
    const legacyFormat = {
      tip: result.tips[0] || "Mantenha o foco nas tarefas importantes",
      challenges: result.tips.slice(1, 4),
      tasks: result.hourlyPlan.reduce((acc, slot) => {
        const activities = slot.activities.map(activity => ({
          task: activity.title,
          details: activity.description || "",
          tips: `Duração estimada: ${activity.estimatedDuration} minutos`
        }));
        if (activities.length > 0) {
          acc[slot.timeSlot] = activities[0];
        }
        return acc;
      }, {} as Record<string, { task: string; details: string; tips: string }>)
    };
    return NextResponse.json(legacyFormat);
  } catch (error) {
    console.error("Erro ao gerar sugestões:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
