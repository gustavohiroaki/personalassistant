import { GenerateDayPlanFactory } from "@/@core/application/usecases/day-plan/factories/generate-day-plan.factory";

// Exemplo de uso do DayPlan Aggregate
export async function exemploUsoDayPlan() {
  const generateDayPlanUseCase = GenerateDayPlanFactory.create();

  // Gerar plano para hoje
  const hoje = new Date();

  const planDodia = await generateDayPlanUseCase.execute({
    date: hoje,
    includeAllTasks: true, // Incluir todas as tarefas pendentes
    includeActiveRoutines: true, // Incluir apenas rotinas ativas
  });

  console.log("Plano do dia gerado:", JSON.stringify(planDodia, null, 2));

  // Gerar prompt para IA (opcional)
  const promptParaIA = generateDayPlanUseCase.generatePromptForAI({
    date: hoje,
  });

  console.log("Prompt para IA:", promptParaIA);

  return planDodia;
}

// Para usar:
// const resultado = await exemploUsoDayPlan();
