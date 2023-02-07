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
let doneToDos;
let checkImgs;
let allToDos = [];
let activeToDos = [];
let completedToDos = new Set();

// DRAG AND DROP VARIABLES
let newToDos;

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

//ToDo
const createTodo = (event) => {
  const newTodo = `<div class="todo-new" draggable="true">
                    <div class="todo-new--check">
                      <div></div>
                    </div>
                    <span class="todo-new--check-img" ></span>
                    <p class="todo-new--text">${event.target.value}</p>
                    <span class="todo-new--img"
                  </div>`;
  todoNewContainer.insertAdjacentHTML("afterbegin", newTodo);
  checkImgs = document.querySelectorAll(".todo-new--check-img");
  newToDos = document.querySelectorAll(".todo-new");

  allToDos.push(todoNewContainer.firstChild);
  activeToDos.push(todoNewContainer.firstChild);

  todoItemsLeft.textContent = `${activeToDos.length} items left`;
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
    });
  });
};

const completeToDo = () => {
  doneToDos = document.querySelectorAll(".todo-new--check");
  doneToDos.forEach((ele) => {
    ele.addEventListener("click", (e) => {
      const todoTextEle = ele.nextElementSibling.nextElementSibling;
      todoTextEle.style.textDecoration = "line-through";

      todoTextEle.style.color = getComputedStyle(
        document.body
      ).getPropertyValue("--clr-text-footer");

      ele.querySelector("div").style.background =
        "-webkit-linear-gradient(" + "#57ddff" + ", " + "#c058f3" + ")";
      ele.nextElementSibling.style.display = "block";

      completedToDos.add(e.currentTarget.closest(".todo-new"));
      activeToDos.forEach((todo, i) => {
        if (e.currentTarget.closest(".todo-new") === todo) {
          activeToDos.splice(i, 1);
          todoItemsLeft.textContent = `${activeToDos.length} items left`;
        }
      });
    });
  });
};

const undoCompletedToDo = () => {
  checkImgs.forEach((ele) => {
    ele.addEventListener("click", (e) => {
      const todoTextEle = ele.nextElementSibling;

      todoTextEle.style.textDecoration = "none";

      todoTextEle.style.color = getComputedStyle(
        document.body
      ).getPropertyValue("--clr-text");

      ele.style.display = "none";

      const checkBox = ele.previousElementSibling.querySelector("div");
      checkBox.style.background = getComputedStyle(
        document.body
      ).getPropertyValue("--clr-bg-todo");

      const currentTodo = e.currentTarget.closest(".todo-new");
      activeToDos.push(currentTodo);
      todoItemsLeft.textContent = `${activeToDos.length} items left`;
    });
  });
};

todoInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    createTodo(e);
    removeTodo();
    completeToDo();
    undoCompletedToDo();
    e.target.value = "";
  }
});

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

  if (completedToDos.size === 0) return;

  allToDos.forEach((ele) => {
    ele.style.display = "none";
  });

  completedToDos.forEach((ele) => {
    ele.style.display = "block";
  });
});

clearCompletedToDos.addEventListener("click", (e) => {
  completedToDos.forEach((ele) => {
    ele.remove();
  });
});
