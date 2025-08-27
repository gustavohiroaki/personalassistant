import db from "../database";
import TaskRepository from "./TaskRepository";
import UserPromptRepository from "./UserPromptRepository";

const dbInstance = db();

const taskRepository = new TaskRepository(dbInstance);
const userPromptRepository = new UserPromptRepository(dbInstance); // You can create other repositories similarly
const repositories = {
  task: taskRepository,
  userPrompt: userPromptRepository,
};
export default repositories;
