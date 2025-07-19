import { ITask } from "@/entities/ITask";
import { db } from "../database";

export const post = async (task: ITask) => {
    return await new Promise<void>((resolve, reject) => {
        db.run(
            `INSERT INTO tasks (title, description, dueDate, priority, completed, createdAt) VALUES (?, ?, ?, ?, ?, ?)`,
            [
                task.title,
                task.description,
                task.dueDate.toISOString(),
                task.priority,
                task.completed ? 1 : 0,
                new Date().toISOString()
            ],
            (err) => {
                if (err) {
                    console.error("Error inserting task:", err.message);
                    reject(err);
                }
                resolve()
            }
        )
    })
}

export const getAll = async () => {
    return await new Promise<ITask[]>((resolve, reject) => {
        db.all<ITask>(
            `SELECT * FROM tasks ORDER BY createdAt DESC`,
            [],
            (err, rows) => {
                if (err) {
                    console.error("Error fetching tasks:", err.message);
                    reject(err);
                }
                resolve(rows as ITask[]);
            }
        )
    });
}