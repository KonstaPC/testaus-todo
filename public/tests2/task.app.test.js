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

  describe("Task logic - additional tests", () => {
it("does not create a task with invalid payload", () => {
const tasks = [];
const payload = { topic: " " }; // invalid topic
const now = 1000;
const result = createTask(tasks, payload, now);
expect(result.length).toBe(0);
});

it("updateTask does not change tasks if ID not found", () => {
const tasks = [{ id: "t1", topic: "Old" }];
const updated = updateTask(tasks, "nonexistent", { topic: "New" }, 1000);
expect(updated).toEqual(tasks);
});

it("toggleComplete correctly toggles multiple times", () => {
let tasks = [{ id: "t1", topic: "Task", completed: false, status: "todo" }];
const now = 1000;
tasks = toggleComplete(tasks, "t1", now);
expect(tasks[0].completed).toBe(true);
expect(tasks[0].status).toBe("done");
tasks = toggleComplete(tasks, "t1", now + 1);
expect(tasks[0].completed).toBe(false);
expect(tasks[0].status).toBe("todo");
});

it("deleteTask does nothing if ID not found", () => {
const tasks = [{ id: "t1", topic: "Task" }];
const result = deleteTask(tasks, "nonexistent");
expect(result).toEqual(tasks);
});

it("validateTask returns false for missing topic", () => {
expect(validateTask({})).toBe(false);
expect(validateTask({ topic: "" })).toBe(false);
expect(validateTask({ topic: " " })).toBe(false);
});

it("validateTask returns true for valid topic", () => {
expect(validateTask({ topic: "Valid" })).toBe(true);
});
});
});