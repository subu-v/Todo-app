"use strict";

const themeDarkImg = document.querySelector(".todo-theme-dark");
const themeLightImg = document.querySelector(".todo-theme-light");
const todoInput = document.querySelector(".todo-input");
const todoNewContainer = document.querySelector(".todo-new-container");
const todoItemsLeft = document.querySelector(".todo-items-left");
const showAllToDos = document.querySelector(".todo-show-all");
const showActiveToDos = document.querySelector(".todo-show-active");
const showCompletedToDos = document.querySelector(".todo-show-completed");
const clearCompletedToDos = document.querySelector(".todo-clear-completed");

let num = 0;
let currentLength = 0;
let doneToDos;
let checkImgs;
let currentToDo;
let allToDos = [];
let activeToDos = [];
let completedToDos = [];
let newToDos;
let fromToDoIndex;
let toToDoIndex;

// Theme Handlers
themeDarkImg.addEventListener("click", (e) => {
  themeLightImg.style.display = "block";
  themeDarkImg.style.display = "none";
  document.body.classList.add("dark-theme");
});

themeLightImg.addEventListener("click", (e) => {
  themeLightImg.style.display = "none";
  themeDarkImg.style.display = "block";
  document.body.classList.remove("dark-theme");
});

// APP TODO FUNCTIONALITY
todoInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.currentTarget.value.trim() === "") return;
  else if (e.key === "Enter") {
    createTodo(e);
    removeTodo();
    completeToDo();
    undoCompletedToDo();
    e.target.value = "";
  }
});

const createTodo = (event) => {
  const newTodo = `<div class="todo-new" draggable="true">
                    <div class="todo-new--check">
                      <div></div>
                    </div>
                    <span class="todo-new--check-img"></span>
                    <p class="todo-new--text">${event.target.value}</p>
                    <span class="todo-new--img"
                  </div>`;
  todoNewContainer.insertAdjacentHTML("afterbegin", newTodo);
  checkImgs = document.querySelectorAll(".todo-new--check-img");
  newToDos = document.querySelectorAll(".todo-new");

  allToDos.push(todoNewContainer.firstChild);
  activeToDos.push(todoNewContainer.firstChild);
  editToDoBorderRadius(newToDos);
  todoItemsLeft.textContent = `${activeToDos.length} items left`;

  // FOR DRAG AND DROP
  // .push(todoNewContainer.firstChild);
  dragAndDrop();
};

const removeTodo = () => {
  const cancelTodoArray = document.querySelectorAll(".todo-new--img");
  cancelTodoArray.forEach((ele) => {
    ele.addEventListener("click", (e) => {
      ele.closest(".todo-new").remove();
      allToDos.forEach((todo, i) => {
        if (e.currentTarget.closest(".todo-new") === todo) {
          allToDos.splice(i, 1);
        }
      });
      activeToDos.forEach((todo, i) => {
        if (e.currentTarget.closest(".todo-new") === todo) {
          activeToDos.splice(i, 1);
          todoItemsLeft.textContent = `${activeToDos.length} items left`;
        }
      });
      arrToDos.forEach((todo, index) => {
        if (todo === e.currentTarget.closest(".todo-new")) {
          arrToDos.splice(index, 1);
        }
      });
    });
  });
};

const completeToDo = () => {
  doneToDos = document.querySelectorAll(".todo-new--check");
  doneToDos.forEach((checkBox) => {
    checkBox.addEventListener("click", (e) => {
      // The reason im selecting checkbox Element nextElementSiblings nextElement is because of
      // wanting to style the <p> element of the todo
      const todoTextEle = checkBox.nextElementSibling.nextElementSibling;
      todoTextEle.style.textDecoration = "line-through";
      todoTextEle.style.color = getComputedStyle(
        document.body
      ).getPropertyValue("--clr-text-footer");

      checkBox.querySelector("div").style.background =
        "-webkit-linear-gradient(" + "#57ddff" + ", " + "#c058f3" + ")";

      // Initiall when user creates a todo, the checkbox checked img is of display:none
      // in order for it to be invisible, but as soon as the user clicks the checkbox,
      // It should have the style display:block to be displayed in the UI.
      checkBox.nextElementSibling.style.display = "block";

      // completedToDos.add(e.currentTarget.closest(".todo-new"));
      completedToDos.push(e.currentTarget.closest(".todo-new"));

      // Removing the todo that is checked from the activeToDos array and display itemsLeft
      // based on activeToDos.length property on the UI.
      activeToDos.forEach((todo, i) => {
        if (e.currentTarget.closest(".todo-new") === todo) {
          activeToDos.splice(i, 1);
          currentLength = activeToDos.length;
          todoItemsLeft.textContent = `${activeToDos.length} items left`;
        }
      });
    });
  });
};

const undoCompletedToDo = () => {
  checkImgs.forEach((checkImg) => {
    checkImg.addEventListener("click", (e) => {
      // Selecting nextElementSibling of checkImg element because wanting to undo the style done
      // when previously checked on the <p> element which is the next sibling element of the checkImg
      const todoTextEle = checkImg.nextElementSibling;
      todoTextEle.style.textDecoration = "none";
      todoTextEle.style.color = getComputedStyle(
        document.body
      ).getPropertyValue("--clr-text");

      // Once unchecked, the checkedImg element should no longer be displayed on the UI, that's why
      // display = "none" is used
      checkImg.style.display = "none";

      // CheckImg previousElementSibling is checkBox and using querySelector('div') on it gives
      // the div inside it, the reason for selecting it, to change the linear-gradient it was given
      // previously when checked to todo background color.
      const checkBox = checkImg.previousElementSibling.querySelector("div");
      checkBox.style.background = getComputedStyle(
        document.body
      ).getPropertyValue("--clr-bg-todo");

      completedToDos.forEach((todo, index) => {
        if (todo === e.currentTarget.closest(".todo-new"))
          completedToDos.splice(index, 1);
      });

      // Selecting currentTodo cause it needs to be added to the activeToDos array cause it was previously
      // removed from it when the todo was checked
      currentToDo = e.currentTarget.closest(".todo-new");
      if (currentLength !== activeToDos.length) {
        return;
      } else {
        activeToDos.push(currentToDo);
        todoItemsLeft.textContent = `${activeToDos.length} items left`;
      }
    });
  });
};

const editToDoBorderRadius = function (todos) {
  todos.forEach((todo) => {
    if (!todo.previousElementSibling) {
      todo.style.borderTopLeftRadius = "5px";
      todo.style.borderTopRightRadius = "5px";
    } else {
      todo.style.borderTopLeftRadius = "0px";
      todo.style.borderTopRightRadius = "0px";
    }
  });
};

showAllToDos.addEventListener("click", (e) => {
  showAllToDos.style.color = "hsl(220, 98%, 61%)";

  allToDos.forEach((ele) => {
    ele.style.display = "block";
  });

  showCompletedToDos.style.color = getComputedStyle(
    document.body
  ).getPropertyValue("--clr-text-status");

  showActiveToDos.style.color = getComputedStyle(
    document.body
  ).getPropertyValue("--clr-text-status");
});

showActiveToDos.addEventListener("click", (e) => {
  showActiveToDos.style.color = "hsl(220, 98%, 61%)";

  showAllToDos.style.color = getComputedStyle(document.body).getPropertyValue(
    "--clr-text-status"
  );

  showCompletedToDos.style.color = getComputedStyle(
    document.body
  ).getPropertyValue("--clr-text-status");

  allToDos.forEach((ele) => {
    ele.style.display = "none";
  });

  activeToDos.forEach((ele) => {
    ele.style.display = "block";
  });
});

showCompletedToDos.addEventListener("click", (e) => {
  showCompletedToDos.style.color = "hsl(220, 98%, 61%)";
  showAllToDos.style.color = getComputedStyle(document.body).getPropertyValue(
    "--clr-text-status"
  );

  showActiveToDos.style.color = getComputedStyle(
    document.body
  ).getPropertyValue("--clr-text-status");

  if (completedToDos.length === 0) return;

  allToDos.forEach((ele) => {
    ele.style.display = "none";
  });

  completedToDos.forEach((ele) => {
    ele.style.display = "block";
  });
});

clearCompletedToDos.addEventListener("click", (e) => {
  console.log(allToDos);
  completedToDos.forEach((ele) => {
    ele.remove();
    allToDos.forEach((todo, index) => {
      if (todo === ele) {
        allToDos.splice(index, 1);
      }
    });
  });
  console.log(allToDos);
});

// DRAG AND DROP FUNCTIONALITY
const dragStart = function () {
  allToDos.forEach((ele, index) => {
    if (this === ele) {
      fromToDoIndex = index;
    }
  });
};

const dragEnter = function () {
  this.classList.add("todo-new--over");
};

const dragLeave = function () {
  this.classList.remove("todo-new--over");
};

const dragDrop = function () {
  allToDos.forEach((ele, index) => {
    if (this === ele) {
      toToDoIndex = index;
    }
  });

  swapItems(fromToDoIndex, toToDoIndex);
  this.classList.remove("todo-new--over");
};

const swapItems = function (from, to) {
  const fromToDo = allToDos[from];
  const toToDo = allToDos[to];

  allToDos[from] = toToDo;
  allToDos[to] = fromToDo;

  reordering();
};

const reordering = function () {
  newToDos.forEach((ele) => {
    ele.remove();
  });
  allToDos.forEach((ele) => {
    todoNewContainer.insertAdjacentElement("afterbegin", ele);
  });
  editToDoBorderRadius(newToDos);
};

const dragOver = function (event) {
  event.preventDefault();
};

const dragAndDrop = function () {
  newToDos.forEach((ele) => {
    ele.addEventListener("dragstart", dragStart);
    ele.addEventListener("dragover", dragOver);
    ele.addEventListener("drop", dragDrop);
    ele.addEventListener("dragenter", dragEnter);
    ele.addEventListener("dragleave", dragLeave);
  });
};

// USING LOCALSTORAGE API TO STORE THE TODO'S
