import OpenAI from "openai";
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function promptHelper(
  prompt: string,
  instructions?: string
) {
  const params = {
    model: "gpt-5-nano",
    input: prompt,
    ...(instructions ? { instructions } : {}),
  };
  console.log("Prompt Params:", params);
  return client.responses.create(params);
}
