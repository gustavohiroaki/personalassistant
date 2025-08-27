import db from "@/backend/database";

export const migrate = () => {
  db().instance.serialize(() => {
    db().instance.run(
      `
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                dueDate TEXT,
                priority TEXT,
                completed BOOLEAN DEFAULT 0,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `,
      (err) => {
        if (err) {
          console.error("Error creating tasks table:", err.message);
        } else {
          console.log("Tasks table is ready.");
        }
      }
    );
    db().instance.run(
      `
            CREATE TABLE IF NOT EXISTS user_prompts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                prompt TEXT NOT NULL
            )
        `,
      (err) => {
        if (err) {
          console.error("Error creating user_prompts table:", err.message);
        } else {
          console.log("User Prompts table is ready.");
        }
      }
    );
  });
};

migrate();
