"use strict";
import "../style/main.scss";
import todoIcon from "../assets/todo.png";
import { ToDo } from "./main.js";

// this file is responsible for collecting all functionalities and elements from modules

/**Creates header that contains logo text and icon */
function header() {
  const header = document.createElement("div");
  header.classList.add("header");

  const div = document.createElement("div");
  div.classList.add("header__min-container");

  const text = document.createElement("span");
  text.classList.add("header__text");
  text.textContent = "todo list";

  const icon = document.createElement("img");
  icon.classList.add("header__icon");
  icon.src = todoIcon;

  div.appendChild(text);
  div.appendChild(icon);
  header.appendChild(div);
  return header;
}

function initialLoad() {
  const container = document.createElement("div");
  container.classList.add("container");

  const mainContent = new ToDo();
  const headerDiv = header();
  container.appendChild(headerDiv);
  container.appendChild(mainContent);
  return container;
}

document.body.appendChild(initialLoad());
