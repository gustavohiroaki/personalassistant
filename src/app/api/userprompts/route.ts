import { IUserPrompt, IUserPromptCreate } from "@/entities/IUserPrompt";
import { get, update } from "@/utils/fs-json";

export async function POST(req: Request) {
  const body = (await req.json()) as IUserPromptCreate;

  const userPrompt: IUserPromptCreate = {
    prompt: body.prompt,
  };

  try {
    update(userPrompt);
    return new Response("User prompt created successfully", { status: 201 });
  } catch (error) {
    console.error("Error creating user prompt:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function GET() {
  const parametersJson = get() as IUserPrompt;
  const response = parametersJson.prompt
    ? { prompt: parametersJson.prompt }
    : { prompt: "" };
  return new Response(JSON.stringify(response), { status: 200 });
}
