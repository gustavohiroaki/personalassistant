import knex from "knex";
import path from "path";
const db = knex({
  client: "better-sqlite3",
  connection: {
    filename: path.join(process.cwd(), "/tasks.db"),
  },
  useNullAsDefault: true,
  acquireConnectionTimeout: 60000,
});
export default db;
