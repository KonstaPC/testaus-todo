/// <reference types="cypress" />

describe("Todo App E2E Tests", () => {
  const STORAGE_KEY = "todo_tasks_v1";

  beforeEach(() => {
    cy.visit("http://localhost:5173", {
      onBeforeLoad(win) {
        win.localStorage.clear();
      }
    });
  });

  it("creates a new task with minimum required fields", () => {
    const topic = "Test Task Minimal";

    cy.get("#topic").type(topic);
    cy.get("#save-btn").click();

    cy.get("#task-list li")
      .should("have.length", 1)
      .first()
      .within(() => {
        cy.get(".title").should("contain.text", topic);
        cy.get(".desc").should("have.text", "");
      });

    cy.window().then((win) => {
      const tasks = JSON.parse(win.localStorage.getItem(STORAGE_KEY));
      expect(tasks).to.have.length(1);
      expect(tasks[0].topic).to.eq(topic);
      expect(tasks[0].priority).to.eq("medium");
      expect(tasks[0].status).to.eq("todo");
    });
  });

  it("creates a task with all fields populated", () => {
    const task = {
      topic: "Full Task",
      description: "This is a detailed description",
      priority: "high",
      status: "in-progress",
    };

    cy.get("#topic").type(task.topic);
    cy.get("#description").type(task.description);
    cy.get("#priority").select(task.priority);
    cy.get("#status").select(task.status);
    cy.get("#save-btn").click();

    cy.get("#task-list li").first().within(() => {
      cy.get(".title").should("contain.text", task.topic);
      cy.get(".desc").should("contain.text", task.description);
      cy.get(".badge").should("contain.text", "High");
    });
  });

  it("edits an existing task and toggles status", () => {
    cy.get("#topic").type("Editable Task");
    cy.get("#save-btn").click();

    cy.get("#task-list li").first().find('button[data-action="edit"]').click();

    cy.get("#topic").clear().type("Updated Task");
    cy.get("#status").select("done");
    cy.get("#save-btn").click();

    cy.get("#task-list li")
      .first()
      .should("have.class", "done")
      .find(".badge")
      .should("contain.text", "Done");
  });

  it("completes and undoes a task", () => {
    cy.get("#topic").type("Complete Task");
    cy.get("#save-btn").click();

    cy.get("#task-list li").first().as("task");

    // Complete
    cy.get("@task")
      .find('button[data-action="complete"]')
      .click();

    cy.get("@task").should("have.class", "done");

    // Undo
    cy.get("@task")
      .find('button[data-action="complete"]')
      .click();

    cy.get("@task").should("not.have.class", "done");
  });

  it("deletes a task with confirmation", () => {
    cy.get("#topic").type("Task to Delete");
    cy.get("#save-btn").click();

    cy.on("window:confirm", () => true);

    cy.get("#task-list li").first().find('button[data-action="delete"]').click();

    cy.get("#task-list li").should("have.length", 0);
    cy.get("#empty-state").should("be.visible");
  });

  it("ensures tasks persist in localStorage after reload", () => {
    cy.get("#topic").type("Persistent Task");
    cy.get("#save-btn").click();

    cy.reload();

    cy.get("#task-list li").should("have.length", 1);
    cy.contains(".title", "Persistent Task").should("exist");
  });

  it("prevents XSS in input", () => {
    const malicious = '<img src=x onerror=alert("XSS")>';

    cy.get("#topic").type(malicious);
    cy.get("#save-btn").click();

    cy.get(".title")
      .should("contain.text", malicious)
      .and("not.contain.html", malicious);
  });

  it("limits topic length and stores truncated value safely", () => {
  const longTopic = "a".repeat(300);

  cy.get("#topic").type(longTopic);
  cy.get("#save-btn").click();

  // UI: tehtävä syntyy
  cy.get("#task-list li").should("have.length", 1);

  // Data: tallennettu arvo on katkaistu mutta ei tyhjä
  cy.window().then((win) => {
    const tasks = JSON.parse(win.localStorage.getItem("todo_tasks_v1"));
    const storedTopic = tasks[0].topic;

    expect(storedTopic.length).to.be.lessThan(longTopic.length);
    expect(storedTopic.length).to.be.greaterThan(0);
  });
  });

  it("uses correct default values when optional fields are not set", () => {
  cy.get("#topic").type("Default values task");
  cy.get("#save-btn").click();

  cy.window().then((win) => {
    const tasks = JSON.parse(win.localStorage.getItem("todo_tasks_v1"));
    const task = tasks[0];

    expect(task.priority).to.eq("medium");
    expect(task.status).to.eq("todo");
    expect(task.completed).to.eq(false);
    expect(task.description).to.eq("");
  });
  });

  it("resets the form when reset button is clicked", () => {
  cy.get("#topic").type("Temporary task");
  cy.get("#description").type("Temporary description");
  cy.get("#priority").select("high");
  cy.get("#status").select("in-progress");

  cy.get("#reset-btn").click();

  cy.get("#topic").should("have.value", "");
  cy.get("#description").should("have.value", "");
  cy.get("#priority").should("have.value", "medium");
  cy.get("#status").should("have.value", "todo");
  cy.get("#task-id").should("have.value", "");
  });
});