import db from "@/old/database";
export const migrate = () => {
  db().instance.serialize(() => {
    db().instance.run(
      `
            CREATE TABLE IF NOT EXISTS tasks (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                description TEXT,
                dueDate TEXT,
                priority TEXT,
                completed BOOLEAN DEFAULT 0,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP
            )
        `,
      (err) => {
        if (err) {
          console.error("Error creating tasks table:", err.message);
        } else {
          console.log("Tasks table is ready.");
          db().instance.run(
            `ALTER TABLE tasks ADD COLUMN category TEXT`,
            (err) => {
              if (err) {
                if (!err.message.includes("duplicate column name")) {
                  console.error("Error adding category to tasks:", err.message);
                }
              } else {
                console.log("Category column added to tasks table.");
              }
            }
          );
        }
      }
    );
    db().instance.run(
      `
            CREATE TABLE IF NOT EXISTS prompts (
                id TEXT PRIMARY KEY,
                prompt TEXT NOT NULL,
                systemPrompt TEXT,
                response TEXT,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP
            )
        `,
      (err) => {
        if (err) {
          console.error("Error creating prompts table:", err.message);
        } else {
          console.log("Prompts table is ready.");
        }
      }
    );
    db().instance.run(
      `
            CREATE TABLE IF NOT EXISTS routines (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                description TEXT,
                frequency TEXT NOT NULL,
                startDate TEXT NOT NULL,
                endDate TEXT,
                active BOOLEAN DEFAULT 1,
                daysOfWeek TEXT,
                dayOfMonth INTEGER,
                daysOfMonth TEXT,
                month INTEGER,
                dayOfYear INTEGER,
                customRule TEXT,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP
            )
        `,
      (err) => {
        if (err) {
          console.error("Error creating routines table:", err.message);
        } else {
          console.log("Routines table is ready.");
          db().instance.run(
            `ALTER TABLE routines ADD COLUMN category TEXT`,
            (err) => {
              if (err) {
                if (!err.message.includes("duplicate column name")) {
                  console.error(
                    "Error adding category to routines:",
                    err.message
                  );
                }
              } else {
                console.log("Category column added to routines table.");
              }
            }
          );
        }
      }
    );
  });
};
migrate();