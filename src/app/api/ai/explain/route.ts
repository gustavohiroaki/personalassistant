import { makeCreatePromptUseCase } from "@/@core/application/usecases/prompt/factories/create.prompt.factory";
import { NextResponse } from "next/server";
const systemPrompt = `Você é um assistente especialista em produtividade e gestão de tempo.
Sua resposta DEVE ser em Markdown, usando títulos em negrito e listas para organização.
NÃO use saudações ou texto conversacional. Seja direto e objetivo.
Estruture sua resposta usando EXATAMENTE os seguintes títulos:
- **Plano de Ação:**
- **Estratégias de Foco:**
- **Estimativa de Tempo:**`;
export async function POST(request: Request) {
  const { title, description, priority, dueDate } = await request.json();
  const prompt = `Analise a tarefa a seguir e gere o guia de execução: Título: ${title};Descrição: ${description};Prioridade: ${priority};Data Limite: ${dueDate}`;
  const response = await makeCreatePromptUseCase().execute({
    prompt,
    systemPrompt,
  });
  return NextResponse.json({
    message: response,
  });
}
