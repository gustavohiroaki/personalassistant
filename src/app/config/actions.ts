"use server";
import { revalidatePath } from "next/cache";
export default async function config(formData: FormData) {
  const userPrompt = formData.get("user-prompt")?.toString();
  await fetch("http:
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt: userPrompt }),
  });
  revalidatePath("/config");
}
