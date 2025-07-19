import { db } from "./database"

export const migrate = () => {
    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                dueDate TEXT,
                priority TEXT,
                completed BOOLEAN DEFAULT 0,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) {
                console.error("Error creating tasks table:", err.message);
            } else {
                console.log("Tasks table is ready.");
            }
        });
    })
}

migrate()