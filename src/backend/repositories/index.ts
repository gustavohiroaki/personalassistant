import db from "../database";
import TaskRepository from "./TaskRepository";

const dbInstance = db()

const taskRepository = new TaskRepository(dbInstance);
const repositories = {
    task: taskRepository
}
export default repositories