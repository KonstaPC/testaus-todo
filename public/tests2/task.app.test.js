import { describe, it, expect } from "vitest";
import {
  generateId,
  createTask,
  updateTask,
  toggleComplete,
  deleteTask,
  validateTask
} from "./taskapplogic.js";

describe("Task logic functions", () => {

  it("generates unique IDs", () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
    expect(typeof id1).toBe("string");
  });

  it("validates tasks correctly", () => {
    expect(validateTask({ topic: "X" })).toBe(true);
    expect(validateTask({ topic: "" })).toBe(false);
    expect(validateTask({})).toBe(false);
  });

  it("creates a task correctly", () => {
    const tasks = [];
    const payload = { topic: "Test", priority: "high", status: "todo", description: "desc" };
    const now = 1000;
    const newTasks = createTask(tasks, payload, now);

    expect(newTasks.length).toBe(1);
    const task = newTasks[0];
    expect(task.topic).toBe("Test");
    expect(task.completed).toBe(false);
    expect(task.status).toBe("todo");
    expect(task.priority).toBe("high");
    expect(task.description).toBe("desc");
    expect(task.createdAt).toBe(now);
    expect(task.updatedAt).toBe(now);
  });

  it("updates a task correctly", () => {
    const tasks = [{
      id: "t1",
      topic: "Old",
      status: "todo",
      completed: false,
      createdAt: 500,
      updatedAt: 500,
      priority: "medium",
      description: ""
    }];
    const payload = { topic: "New", status: "done", description: "Updated" };
    const now = 1000;

    const updatedTasks = updateTask(tasks, "t1", payload, now);
    const task = updatedTasks[0];

    expect(task.topic).toBe("New");
    expect(task.completed).toBe(true);
    expect(task.status).toBe("done");
    expect(task.updatedAt).toBe(now);
    expect(task.description).toBe("Updated");
  });

  it("toggles completion status correctly", () => {
    const tasks = [{
      id: "t1",
      topic: "Task",
      status: "todo",
      completed: false,
      createdAt: 0,
      updatedAt: 0,
      priority: "medium",
      description: ""
    }];
    const now = 1000;

    const toggled = toggleComplete(tasks, "t1", now);
    expect(toggled[0].completed).toBe(true);
    expect(toggled[0].status).toBe("done");
    expect(toggled[0].updatedAt).toBe(now);

    const toggledBack = toggleComplete(toggled, "t1", now + 1);
    expect(toggledBack[0].completed).toBe(false);
    expect(toggledBack[0].status).toBe("todo");
    expect(toggledBack[0].updatedAt).toBe(now + 1);
  });

  it("deletes a task correctly", () => {
    const tasks = [{
      id: "t1",
      topic: "DeleteMe",
      status: "todo",
      completed: false,
      createdAt: 0,
      updatedAt: 0,
      priority: "medium",
      description: ""
    }];
    const result = deleteTask(tasks, "t1");
    expect(result.length).toBe(0);
  });
});