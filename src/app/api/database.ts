import sqlite3 from "sqlite3"
import path from "path"

const dbPath = path.join(process.cwd(), "tasks.db")

export const db = new sqlite3.Database(
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