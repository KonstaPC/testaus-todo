// src/taskAppLogic.js

export function generateId() {
  return (
    't_' +
    Math.random().toString(36).slice(2, 8) +
    Date.now().toString(36).slice(-4)
  );
}

export function validateTask(payload) {
  return !!(payload.topic && payload.topic.trim().length > 0);
}

export function createTask(tasks, payload, now) {
  if (!validateTask(payload)) return tasks;
  const newTask = {
    id: generateId(),
    ...payload,
    completed: payload.status === 'done',
    createdAt: now,
    updatedAt: now,
  };
  return [...tasks, newTask];
}

export function updateTask(tasks, id, payload, now) {
  return tasks.map((t) => {
    if (t.id !== id) return t;
    return {
      ...t,
      ...payload,
      completed: payload.status === 'done' ? true : t.completed,
      updatedAt: now,
    };
  });
}

export function toggleComplete(tasks, id, now) {
  return tasks.map((t) => {
    if (t.id !== id) return t;
    const nextCompleted = !t.completed;
    return {
      ...t,
      completed: nextCompleted,
      status: nextCompleted
        ? 'done'
        : t.status === 'done'
        ? 'todo'
        : t.status,
      updatedAt: now,
    };
  });
}

export function deleteTask(tasks, id) {
  return tasks.filter((t) => t.id !== id);
}