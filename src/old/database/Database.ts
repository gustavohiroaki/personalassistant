import path from "path";
import sqlite3 from "sqlite3";

export default class Database {
  public instance: sqlite3.Database;

  constructor() {
    const dbPath = path.join(process.cwd(), "tasks.db");
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
    );
  }

  private buildQueryFilters(query: object): {
    whereClause: string;
    values: (string | number | boolean | null)[];
  } {
    const conditions: string[] = [];
    const values: (string | number | boolean | null)[] = [];

    for (const [key, value] of Object.entries(query)) {
      if (typeof value === "object" && value !== null) {
        for (const [operator, operatorValue] of Object.entries(value)) {
          if (["=", ">", "<", ">=", "<=", "!="].includes(operator)) {
            conditions.push(`${key} ${operator} ?`);
            values.push(operatorValue as string | number | boolean | null);
          }
        }
      } else {
        conditions.push(`${key} = ?`);
        values.push(value);
      }
    }

    return {
      whereClause:
        conditions.length > 0 ? `AND ${conditions.join(" AND ")}` : "",
      values,
    };
  }

  public async create(table: string, item: object): Promise<object> {
    const fieldNames = Object.keys(item);
    const fieldValues = Object.values(item);
    return await new Promise((resolve, reject) => {
      this.instance.run(
        `INSERT INTO ${table} (${fieldNames.join(",")}) VALUES (${fieldNames
          .map(() => "?")
          .join(",")})`,
        fieldValues,
        (err) => {
          if (err) {
            console.error("Error inserting item:", err.message);
            reject(err);
          }
          this.getLastInsertId(table).then(resolve).catch(reject);
        }
      );
    });
  }

  public async find(table: string, query: object = {}): Promise<object> {
    const { whereClause, values } = this.buildQueryFilters(query);
    const sql = `SELECT * FROM ${table} WHERE 1=1 ${whereClause} ORDER BY createdAt DESC`;
    return await new Promise((resolve, reject) => {
      this.instance.all(sql, values, (err, rows) => {
        if (err) {
          console.error("Error fetching tasks:", err.message);
          reject(err);
          return;
        }
        resolve(rows);
      });
    });
  }

  public async update(
    table: string,
    id: string,
    item: object
  ): Promise<object | null> {
    const keys = Object.keys(item);
    const values = Object.values(item);
    if (keys.length === 0) return null;
    const setClause = keys.map((key) => `${key} = ?`).join(", ");
    return await new Promise<object | null>((resolve, reject) => {
      this.instance.run(
        `UPDATE ${table} SET ${setClause} WHERE id = ?`,
        [...values, id],
        (err) => {
          if (err) {
            console.error("Error updating task:", err.message);
            reject(err);
            return;
          }
          this.instance.get(
            `SELECT * FROM ${table} WHERE id = ?`,
            [id],
            (err2, row) => {
              if (err2) {
                console.error("Error fetching updated item:", err2.message);
                reject(err2);
                return;
              }
              if (row) {
                resolve(row);
              } else {
                reject("Error on find updated item");
              }
            }
          );
        }
      );
    });
  }

  public async remove(table: string, id: string): Promise<boolean> {
    return await new Promise<boolean>((resolve, reject) => {
      this.instance.run(`DELETE FROM ${table} WHERE id = ?`, [id], (err) => {
        if (err) {
          console.error("Error on removing item:", err.message);
          reject(err);
        }
        resolve(true);
      });
    });
  }

  private getLastInsertId(table: string): Promise<object> {
    return new Promise((resolve, reject) => {
      this.instance.get(
        `SELECT * FROM ${table} WHERE id = last_insert_rowid()`,
        [],
        (err, row) => {
          if (err) {
            console.error("Error fetching last inserted task:", err.message);
            reject(err);
          }
          if (row) {
            resolve(row);
          } else {
            reject("Get last insert id error");
          }
        }
      );
    });
  }
}
