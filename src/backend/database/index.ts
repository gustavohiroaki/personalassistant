import Database from "./Database";

let instance: Database | null = null;

export default function db(): Database {
    if (!instance) {
        instance = new Database();
    }
    return instance;
}