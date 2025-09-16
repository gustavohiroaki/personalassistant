"use server";
import { ITask } from "@/entities/ITask";
export default async function create(formData: FormData) {
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
    category: category || "",
  };
  await fetch("http://localhost:3000/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}
