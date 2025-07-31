'use server'

export async function remove(id: string) {
    await fetch(`http://localhost:3000/api/tasks/${id}`, {
        method: "DELETE"
    });
    return id;
} 