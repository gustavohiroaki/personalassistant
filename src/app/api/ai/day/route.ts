import repositories from "@/@core/repositories";
import promptHelper from "@/old/utils/prompt";
import { get } from "@/utils/fs-json";
import { NextResponse } from "next/server";

const systemPrompt = `Você é um assistente especialista em produtividade e gestão de tempo.
  Sua resposta DEVE ser em JSON, sem texto adicional.
  NÃO use saudações ou texto conversacional. Seja direto e objetivo.
  A estrutura do JSON DEVE ser:
  {
    tip: "Dica geral para melhorar a produtividade",
    challenges: ["3 desafios para ser uma pessoa melhor e mais produtiva"],
    tasks: {
      '00:00 - 01:00': {  'task': 'Descrição da tarefa', 'details': 'Detalhes adicionais', 'tips': 'Dicas para execução'  },
      ...outras horas...
    }
  }
  `;

export async function GET() {
  const parametersJson = get()?.prompt;
  const tasks = await repositories.task.find({
    dueDate: {
      "<=": new Date().toISOString(),
    },
  });

  const tasksString = JSON.stringify(tasks);
  console.log();
  const prompt = `Com base nas seguintes tarefas: ${tasksString}, e considerando o seguinte contexto do usuário: ${parametersJson}, gere uma lista de tarefas para o dia sugerindo o que fazer em cada horário.`;

  const response = await promptHelper(prompt, systemPrompt);
  const parsedResponse = JSON.parse(response.output_text);
  return NextResponse.json(parsedResponse);
}
