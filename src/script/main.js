// this file is responsible for the whole to do list creation
import inboxIcon from "../assets/inbox.png";
import todayIcon from "../assets/today.png";
import weekIcon from "../assets/week.png";
import projectIcon from "../assets/project.png";
import projectHicon from "../assets/projectHeader.png";
import noteIcon from "../assets/note.png";
import addIcon from "../assets/add.png";
import close from "../assets/close.svg";
import todoIcon from "../assets/todo.svg";
import projectClose from "../assets/projectClose.png";
import { setLocalStorage, getFromLocalStorage } from "./helper.js";

let globalData = getFromLocalStorage();
console.log(globalData);
if (!globalData) {
  globalData = { todos: [], projects: [], notes: [] };
}

export class ToDo {
  #container = document.createElement("div");
  #left = document.createElement("div");
  #right = document.createElement("div");
  #leftElemetns;

  constructor() {
    this.getInputForm;
    this.#container.classList.add("main");
    this.#right.classList.add("right");
    // get data from localStorage
    this.#container.appendChild(this.leftContainer);
    this.#container.appendChild(this.#right);
    return this.#container;
  }

  /**Insert element after specified element
   * @params:
   * referenceNode - node, after which we are going to insert new node
   * : new node;
   */
  insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }

  /**Generates elements of left asside of main container*/
  createLeftElements(text, itemIcon = "", isProject = false) {
    const classText = text.split(" ");
    const item = document.createElement("div");
    item.classList.add(
      `left-container__${classText[1] ? classText[1] : classText[0]}`
    );
    if (text == "projects") item.classList.add("left-container__projects");

    item.classList.add(`left-container__item`);

    const icon = document.createElement("img");
    icon.classList.add("left-container__icon");

    if (isProject) {
      item.classList.add("left-container__project");
      icon.src = projectIcon;
    } else {
      icon.src = itemIcon;
    }

    const content = document.createElement("span");
    content.classList.add("left-container__text");
    content.textContent = text;

    item.append(icon, content);
    return item;
  }

  /**Generates a bunch of elements to add in main input, left asside elements */
  createAddItems(itemIcon, context) {
    const div = document.createElement("div");
    div.classList.add("add-todo__left_item");

    const icon = document.createElement("img");
    icon.classList.add("add-todo__left_icon");
    icon.src = itemIcon;

    const text = document.createElement("span");
    text.classList.add("add-todo__left_text");
    text.innerHTML = context;

    div.append(icon, text);
    return div;
  }

  /**Generates left side of the main container, that holds all todos, projects, notes */
  get leftContainer() {
    this.#left.classList.add("left");
    const projects = [];
    const left = document.createElement("div");
    left.classList.add("left-container");

    const inbox = this.createLeftElements("inbox", inboxIcon);
    const today = this.createLeftElements("today", todayIcon);
    const week = this.createLeftElements("this week", weekIcon);
    const projectHeader = this.createLeftElements("projects", projectHicon);
    const notes = this.createLeftElements("notes", noteIcon);
    const projectData = globalData.projects;
    projectData.forEach((item) => {
      const project = this.createLeftElements(item.title, "", true);
      projects.push(project);
    });
    const items = [inbox, today, week, projectHeader, ...projects, notes];
    left.append(...items);

    const fakeItems = [...items];
    fakeItems.splice(3, 1);
    this.#leftElemetns = fakeItems;
    // initial load
    this.rightContainer();
    inbox.classList.add("left-container__item_active");

    const addBtn = document.createElement("img");
    addBtn.classList.add("add-todo");
    addBtn.src = addIcon;
    addBtn.addEventListener("click", this.addTodo.bind(ToDo));

    this.#leftElemetns.forEach((item) => {
      item.addEventListener("click", (event) => {
        this.rightContainer(event);
      });
    });

    this.#left.appendChild(left);
    this.#left.appendChild(addBtn);

    return this.#left;
  }

  /**Generate container, that contains priority buttons  */
  priorityButtons() {
    const priorities = document.createElement("div");
    priorities.classList.add("priority-buttons");

    ["low", "medium", "high"].forEach((item) => {
      const button = document.createElement("button");
      button.classList.add("priority-buttons_item");
      button.classList.add(`priority-buttons_${item}`);
      button.innerHTML = item;
      button.type = "button";
      button.setAttribute("data-pr", item);

      priorities.appendChild(button);
    });

    priorities.addEventListener("click", function (e) {
      const item = e.target;
      if (item.classList.contains("priority-buttons_item")) {
        const mainClass = item.classList[1];
        item.classList.add(`${mainClass}-active`);
        priorities
          .querySelectorAll(".priority-buttons_item")
          .forEach((button) => {
            if (item != button) {
              const btnClass = button.classList[1];
              button.classList.remove(`${btnClass}-active`);
            }
          });
      }
    });

    return priorities;
  }

  input(parent, item = "", type = "todo") {
    const title = document.createElement("input");
    title.type = "text";
    title.placeholder = "Title";
    title.name = "title";
    title.classList.add("add-todo__main-input_title");
    title.required = true;

    const details = document.createElement("textarea");
    details.placeholder = "Details";
    details.name = "details";
    details.classList.add("add-todo__main-input_details");

    const addBtn = document.createElement("button");
    addBtn.classList.add("add-todo__main-input_addbtn");
    addBtn.type = "submit";

    //addBtn.addEventListener("click", this.submitForm);

    // Add todo section
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("add-todo__main-input_todo");

    // due date for todos
    const dueDate = document.createElement("div");
    dueDate.classList.add("add-todo__main-input_todo-div");

    const dateLabel = document.createElement("label");
    dateLabel.innerHTML = "Due Date: ";
    dateLabel.setAttribute("for", "date");

    const dateInput = document.createElement("input");
    dateInput.name = "date";
    dateInput.type = "date";
    dateInput.required = true;

    dueDate.append(dateLabel, dateInput);

    // priority for todos
    const priorityDiv = document.createElement("div");
    priorityDiv.classList.add("add-todo__main-input_todo-div");

    const priorityLabel = document.createElement("label");
    priorityLabel.innerHTML = "Priority: ";

    const priorities = this.priorityButtons();

    priorityDiv.append(priorityLabel, priorities);

    todoDiv.append(dueDate, priorityDiv);

    parent.innerHTML = "";

    // constructing "Lego" here
    if (type == "project") {
      addBtn.textContent = "Create Project";
      parent.append(title, addBtn);
    } else if (type == "note") {
      addBtn.textContent = "Create Note";
      parent.append(title, details, addBtn);
    } else {
      addBtn.textContent = "Add Todo";
      parent.append(title, details, todoDiv, addBtn);
    }

    if (item != "") {
      item.classList.add("add-todo__left_active");
      [...document.getElementsByClassName("add-todo__left_item")].forEach(
        (el) => {
          if (item != el) el.classList.remove("add-todo__left_active");
        }
      );
    }

    return parent;
  }

  /**Generates entire Form Container, when we click + button */
  get getInputForm() {
    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    overlay.classList.add("hidden");

    const form = document.createElement("div");
    form.classList.add("add-todo__form");

    // main container holds left and right sides
    const mainContainer = document.createElement("div");
    mainContainer.classList.add("main-container-input");

    // header creation
    const header = document.createElement("div");
    header.classList.add("add-todo__header");

    const headerText = document.createElement("span");
    headerText.classList.add("add-todo__header_text");
    headerText.textContent = "Create new...";

    const closeForm = document.createElement("img");
    closeForm.src = close;
    closeForm.classList.add("add-todo__header_icon");

    header.append(headerText, closeForm);

    // left asside creation
    const leftAsside = document.createElement("div");
    leftAsside.classList.add("add-todo__left");

    const todo = this.createAddItems(todoIcon, "to do");
    const project = this.createAddItems(projectIcon, "project");
    const note = this.createAddItems(noteIcon, "note");

    leftAsside.append(todo, project, note);

    // main input creation
    let mainInput = document.createElement("form");
    mainInput.classList.add("add-todo__main-input");

    mainInput = this.input(mainInput);
    // packing all elements
    mainContainer.append(leftAsside, mainInput);

    form.append(header, mainContainer);

    // add event listeners right here
    [overlay, closeForm].forEach((item) => {
      item.addEventListener("click", function (e) {
        if (e.target == overlay || e.target == closeForm)
          overlay.classList.add("hidden");
      });
    });

    todo.addEventListener("click", this.input.bind(this, mainInput, todo));

    project.addEventListener(
      "click",
      this.input.bind(this, mainInput, project, "project")
    );

    note.addEventListener(
      "click",
      this.input.bind(this, mainInput, note, "note")
    );

    mainInput.addEventListener("submit", (e) => {
      this.submitForm(e, overlay, this);
    });

    overlay.appendChild(form);
    document.body.appendChild(overlay);
  }

  /**Calback function, executes whenever the submit event happens on input form */
  submitForm(e, overlay) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    const priorityElem = e.target.querySelector(".priority-buttons");
    let priority;
    if (priorityElem) {
      priorityElem
        .querySelectorAll(".priority-buttons_item")
        .forEach((item) => {
          if (item.classList.length == 3) {
            priority = item.classList[2].split("_")[1].split("-")[0];
          }
        });
    }
    if (priority !== undefined) {
      data.priority = priority;
    }
    const size = Object.entries(data).length;
    if (size == 4) {
      globalData.todos.push(data);
    }
    if (size == 2) {
      globalData.notes.push(data);
    } else if (size == 1) {
      // for project
      let reject = false;
      globalData.projects.forEach((project) => {
        if (data.title === project.title) {
          alert("Project names must be unique!");
          reject = true;
        }
      });

      if (!reject) {
        globalData.projects.push(data);
        const project = this.createLeftElements(data.title, "", true);
        const projectsHeader = document.querySelector(
          ".left-container__projects"
        );
        this.insertAfter(projectsHeader, project);
      }
    }
    overlay.classList.add("hidden");
    setLocalStorage(globalData);
  }

  addTodo() {
    document.querySelector(".overlay").classList.remove("hidden");
  }

  createTodo() {
    const todo = document.createElement("div");
    todo.classList.add("todo_div");
  }

  rightContainer(event = undefined) {
    let content = "";
    if (event) {
      const leftItem = event.target.closest(".left-container__item");
      content = leftItem.classList[0].split("__")[1];
      leftItem.classList.add("left-container__item_active");
      this.#leftElemetns.forEach((item) => {
        if (leftItem != item) {
          item.classList.remove("left-container__item_active");
        }
      });
    }
    const mainDiv = document.createElement("div");
    mainDiv.classList.add("right__mainDiv");

    const title = document.createElement("span");
    title.classList.add("right__mainDiv_title");
    if (content) {
      title.textContent = content;
    } else {
      title.textContent = "Inbox";
    }

    this.#right.innerHTML = "";

    mainDiv.append(title);

    this.#right.append(mainDiv);
  }
}
