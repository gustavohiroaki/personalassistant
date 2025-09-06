import { Task } from "@/@core/domain/entities/task.entity";

describe("Task Entity", () => {
  it("should create a new task", () => {
    const task = new Task({
      title: "New Task",
      description: "Task description",
      dueDate: new Date(),
      priority: "medium",
    });
    expect(task).toBeInstanceOf(Task);
    expect(task.title).toBe("New Task");
  });

  it("should create a task from JSON", () => {
    const json = {
      id: "1",
      title: "New Task",
      description: "Task description",
      dueDate: new Date().toISOString(),
      priority: "medium" as const,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    const task = Task.fromJSON(json);
    expect(task).toBeInstanceOf(Task);
    expect(task.id).toBe("1");
  });

  it("should generate json from task", () => {
    const task = new Task({
      title: "New Task",
      description: "Task description",
      dueDate: new Date(),
      priority: "medium",
    });
    const json = task.toJSON();
    expect(json).toEqual({
      id: expect.any(String),
      title: "New Task",
      description: "Task description",
      dueDate: expect.any(String),
      priority: "medium",
      completed: false,
      createdAt: expect.any(String),
    });
  });
});
