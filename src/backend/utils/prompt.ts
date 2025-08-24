import OpenAI from "openai";
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function promptHelper(
  prompt: string,
  instructions?: string
) {
  return client.responses.create({
    model: "gpt-5-nano",
    input: prompt,
    ...(instructions ? { instructions } : {}),
  });
}
