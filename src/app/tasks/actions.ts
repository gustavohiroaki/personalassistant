'use server'
import { ITaskUpdate } from "@/entities/ITask";
export async function remove(id: string) {
    await fetch(`http:
        method: "DELETE"
    });
    return id;
}
export async function patch(id: string, data: ITaskUpdate) {
    const response = await fetch(`http:
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        throw new Error("Failed to update task");
    }
    const responseData = await response.json();
    return responseData;
}