"use strict";

const btnAddTask = document.querySelector(".btn-add-task");
const inpAddTask = document.querySelector(".inp-add-task");
const tasksCounter = document.querySelector(".tasks-counter");
const tasksContainer = document.querySelector(".tasks");
const checkboxes = document.getElementsByClassName("checkbox");
const btnsTrash = document.getElementsByClassName("trash-icon");

const tasks = [];

function countTasks() {
  const tasksNum = tasks.reduce(
    (acc, task) => (!task.isFinished ? ++acc : acc),
    0,
  );
  tasksNum === 1
    ? (tasksCounter.textContent = `${tasksNum} task remaining`)
    : (tasksCounter.textContent = `${tasksNum} tasks remaining`);
}

function displayTasks() {
  // remove past ui
  tasksContainer.innerHTML = "";
  // show tasks in the task container
  tasks.forEach((task, i) => {
    const injected = `
        <div class="task">
            <div class="task-title">
                <input
                  type="checkbox"
                  class="checkbox"
                  index="${i}"
                  ${task.isFinished? "checked" : ''}>
                <div>${task.taskBody}</div>
            </div>
            <div class="trash-icon" index = "${i}">
                <i class="fa-regular fa-trash-can"></i>
            </div>
        </div>`;
    tasksContainer.insertAdjacentHTML("beforeend", injected);
  });
  //add event listners to checkboxes
  for (const checkbox of checkboxes) {
    checkbox.addEventListener("change", function (e) {
      const index = Number(e.target.getAttribute("index"));
      tasks[index].isFinished = e.target.checked;
      updateUI();
    })
  }
  // add event listners to the trashicons
  for (const btn of btnsTrash) {
    btn.addEventListener("click", function (e) {
      const index = Number(e.target.getAttribute("index"));
      tasks.splice(index, 1);
      updateUI();
    })
  }
}


function updateUI() {
  displayTasks();
  countTasks();
  if (tasks.length === 0) {
    tasksContainer.insertAdjacentHTML("beforeend", 
      `<p class="no-tasks">There are no tasks remaining.</p>`
    )
  }
}


btnAddTask.addEventListener("click", function (e) {
  e.preventDefault();
  const taskBody = inpAddTask.value;
  if (taskBody.length > 0) {
    tasks.push({ taskBody: taskBody, isFinished: false });
    inpAddTask.value = "";
    inpAddTask.blur();
    updateUI();
  }
});

