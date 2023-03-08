"use strict";
import "../style/main.scss";
import todoIcon from "../assets/todo.png";
import menuIcon from "../assets/menu.jpg";
import closeMenu from "../assets/closeMenu.svg";
import { ToDo } from "./main.js";

// this file is responsible for collecting all functionalities and elements from modules
const mainContent = new ToDo();
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

  div.append(text, icon);

  const menu = document.createElement("img");
  menu.src = menuIcon;
  menu.classList.add("header__menu");

  header.append(div, menu);
  return header;
}

function initialLoad() {
  const container = document.createElement("div");
  container.classList.add("container");

  const headerDiv = header();
  container.appendChild(headerDiv);
  container.appendChild(mainContent);

  let open = false;
  const menu = headerDiv.querySelector(".header__menu");
  const add = mainContent.querySelector(".add-todo");
  const left = mainContent.querySelector(".left-container");
  const mainLeft = mainContent.querySelector(".left");
  const right = mainContent.querySelector(".right");
  if (innerWidth <= 600) {
    if (mainContent.contains(mainLeft)) {
      mainContent.removeChild(mainLeft);
    }
    if (!headerDiv.contains(menu)) headerDiv.append(menu);
    if (!right.contains(add)) right.append(add);
  } else {
    if (headerDiv.contains(menu)) headerDiv.removeChild(menu);
    if (!mainContent.contains(mainLeft)) mainContent.prepend(mainLeft);
    if (right.contains(add)) right.removeChild(add);
  }

  menu.addEventListener("click", function (e) {
    if (open) {
      this.src = menuIcon;
      if (mainContent.contains(left)) mainContent.removeChild(left);
      open = false;
    } else {
      this.src = closeMenu;
      if (!mainContent.contains(left)) mainContent.prepend(left);
      open = true;
    }
  });

  window.addEventListener("resize", function (e) {
    if (innerWidth <= 600) {
      if (mainContent.contains(mainLeft)) {
        mainContent.removeChild(mainLeft);
      }
      if (!headerDiv.contains(menu)) headerDiv.append(menu);
      if (!right.contains(add)) right.append(add);
    } else {
      if (mainContent.contains(left)) mainContent.removeChild(left);
      if (headerDiv.contains(menu)) headerDiv.removeChild(menu);
      if (!mainContent.contains(mainLeft)) mainContent.prepend(mainLeft);
      if (!mainLeft.contains(left)) mainLeft.append(left);
      if (right.contains(add)) right.removeChild(add);
      if (!mainLeft.contains(add)) mainLeft.append(add);
    }
  });

  return container;
}

document.body.appendChild(initialLoad());
