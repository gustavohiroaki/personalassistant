import { ITask, ITaskUpdate } from "@/entities/ITask";
import { db } from "../database";

export const post = async (task: ITask) => {
    return await new Promise<void>((resolve, reject) => {
        db.run(
            `INSERT INTO tasks (title, description, dueDate, priority, completed, createdAt) VALUES (?, ?, ?, ?, ?, ?)`,
            [
                task.title,
                task.description,
                new Date(task.dueDate).toISOString(),
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

export const get = async (filters: object = {}) => {
    const sqlFilters = Object.entries(filters).reduce((acc, [key, value]) => {
        if (value) {
            acc += ` AND ${key} = '${value}'`;
        }
        return acc;
    }, "");
    return await new Promise<ITask[]>((resolve, reject) => {
        db.all<ITask>(
            `SELECT * FROM tasks WHERE 1=1 ${sqlFilters} ORDER BY createdAt DESC`,
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

export const patch = async (id: string, updates: Omit<ITaskUpdate, "id">) => {
    const setClause = Object.entries(updates).map(([key, value]) => {
        if (key === 'dueDate') {
            return `${key} = '${new Date(value as string).toISOString()}'`;
        }
        return `${key} = ${typeof value === 'boolean' ? (value ? 1 : 0) : `'${value}'`}`;
    }).join(', ');

    return await new Promise<void>((resolve, reject) => {
        db.run(
            `UPDATE tasks SET ${setClause} WHERE id = ?`,
            [id],
            (err) => {
                if (err) {
                    console.error("Error updating task:", err.message);
                    reject(err);
                }
                resolve();
            }
        )
    });
}

export const remove = async (id: string) => {
    return await new Promise<void>((resolve, reject) => {
        db.run(
            `DELETE FROM tasks WHERE id = ?`,
            [id],
            (err) => {
                if (err) {
                    console.error("Error deleting task:", err.message);
                    reject(err);
                }
                resolve();
            }
        )
    });
}
