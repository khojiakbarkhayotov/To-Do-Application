// this file is responsible for getting some useful functions to the other models

export function setLocalStorage(data) {
  const jsonData = JSON.stringify(data);
  localStorage.setItem("todo", jsonData);
}

export function getFromLocalStorage() {
  const stringData = localStorage.getItem("todo");
  return JSON.parse(stringData);
}
