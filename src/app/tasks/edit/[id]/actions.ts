"use server";
import { ITask } from "@/entities/ITask";
export async function edit(formData: FormData, id: string) {
  const title = formData.get("title")?.toString();
  const description = formData.get("description")?.toString();
  const dueDate = formData.get("dueDate")?.toString();
  const priority = formData.get("priority")?.toString();
  const category = formData.get("category")?.toString();
  const body: ITask = {
    title: title || "",
    description: description || "",
    dueDate: dueDate ? new Date(dueDate) : new Date(),
    priority: priority as "low" | "medium" | "high",
    completed: false,
    category: category,
  };
  await fetch(`http:
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}
export async function getTask(id: string) {
  const response = await fetch(`http:
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch task");
  }
  return response.json();
}
