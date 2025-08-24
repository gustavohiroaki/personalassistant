import { ITask, ITaskCreate, ITaskUpdate } from "@/entities/ITask";
import path from "path";
import sqlite3 from "sqlite3";

export default class Database {
    public instance: sqlite3.Database;

    constructor() {
        const dbPath = path.join(process.cwd(), "tasks.db")
        this.instance = new sqlite3.Database(
            dbPath,
            sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
            (err) => {
                if (err) {
                    console.error("Error opening database:", err.message);
                } else {
                    console.log("Connected to the tasks database.");
                }
            }
        )
    }

    public async create(task: ITaskCreate): Promise<ITask> {
        return await new Promise<ITask>((resolve, reject) => {
            this.instance.run(
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
                    this.getLastInsertId().then(resolve).catch(reject);
                }
            )
        })
    }

    public async find(query: object = {}): Promise<ITask[]> {
        const keys = Object.keys(query);
        const values = Object.values(query);
        const sqlFilters = keys.map(key => `AND ${key} = ?`).join(' ');
        const sql = `SELECT * FROM tasks WHERE 1=1 ${sqlFilters} ORDER BY createdAt DESC`;
        return await new Promise<ITask[]>((resolve, reject) => {
            this.instance.all<ITask>(
                sql,
                values,
                (err, rows) => {
                    if (err) {
                        console.error("Error fetching tasks:", err.message);
                        reject(err);
                        return;
                    }
                    resolve(rows as ITask[]);
                }
            )
        });
    }

    public async update(id: string, task: ITaskUpdate): Promise<ITask | null> {
        const keys = Object.keys(task) as (keyof ITaskUpdate)[];
        if (keys.length === 0) return null;
        const setClause = keys.map(key => `${key} = ?`).join(', ');
        const values = keys.map(key => {
            const value = task[key];
            if (key === 'dueDate' && typeof value === 'string') {
                return new Date(value).toISOString();
            }
            if (typeof value === 'boolean') {
                return value ? 1 : 0;
            }
            return value;
        });
        return await new Promise<ITask | null>((resolve, reject) => {
            this.instance.run(
                `UPDATE tasks SET ${setClause} WHERE id = ?`,
                [...values, id],
                (err) => {
                    if (err) {
                        console.error("Error updating task:", err.message);
                        reject(err);
                        return;
                    }
                    // Buscar o registro atualizado
                    this.instance.get(`SELECT * FROM tasks WHERE id = ?`, [id], (err2, row) => {
                        if (err2) {
                            console.error("Error fetching updated task:", err2.message);
                            reject(err2);
                            return;
                        }
                        resolve(row as ITask);
                    });
                }
            )
        });
    }

    public async remove(id: string): Promise<boolean> {
        return await new Promise<boolean>((resolve, reject) => {
            this.instance.run(
                "DELETE FROM tasks WHERE id = ?",
                [id],
                (err) => {
                    if (err) {
                        console.error('Error on removing task:', err.message)
                        reject(err)
                    }
                    resolve(true)
                }
            )
        })
    }

    private getLastInsertId(): Promise<ITask> {
        return new Promise<ITask>((resolve, reject) => {
            this.instance.get(`SELECT * FROM tasks WHERE id = last_insert_rowid()`, [], (err, row) => {
                if (err) {
                    console.error("Error fetching last inserted task:", err.message);
                    reject(err);
                }
                resolve(row as ITask);
            });
        });
    }
}