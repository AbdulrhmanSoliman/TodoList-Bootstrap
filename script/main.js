// ========================Dark Mode========================
let pageModeBtn = document.querySelector(".light-dark");
let isDarkMode = false;
let lightSvg = `
<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24px" fill="#fff" viewBox="0 0 20 20">
  <path d="M10 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-11a1 1 0 0 0 1-1V1a1 1 0 0 0-2 0v2a1 1 0 0 0 1 1Zm0 12a1 1 0 0 0-1 1v2a1 1 0 1 0 2 0v-2a1 1 0 0 0-1-1ZM4.343 5.757a1 1 0 0 0 1.414-1.414L4.343 2.929a1 1 0 0 0-1.414 1.414l1.414 1.414Zm11.314 8.486a1 1 0 0 0-1.414 1.414l1.414 1.414a1 1 0 0 0 1.414-1.414l-1.414-1.414ZM4 10a1 1 0 0 0-1-1H1a1 1 0 0 0 0 2h2a1 1 0 0 0 1-1Zm15-1h-2a1 1 0 1 0 0 2h2a1 1 0 0 0 0-2ZM4.343 14.243l-1.414 1.414a1 1 0 1 0 1.414 1.414l1.414-1.414a1 1 0 0 0-1.414-1.414ZM14.95 6.05a1 1 0 0 0 .707-.293l1.414-1.414a1 1 0 1 0-1.414-1.414l-1.414 1.414a1 1 0 0 0 .707 1.707Z"></path>
</svg>
`;
let darkSvg = `
<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24px"  fill="currentColor" viewBox="0 0 18 20">
  <path d="M17.8 13.75a1 1 0 0 0-.859-.5A7.488 7.488 0 0 1 10.52 2a1 1 0 0 0 0-.969A1.035 1.035 0 0 0 9.687.5h-.113a9.5 9.5 0 1 0 8.222 14.247 1 1 0 0 0 .004-.997Z"></path>
</svg>`;
if (localStorage.theme === "dark") {
  document.documentElement.setAttribute("data-bs-theme", "dark");
  pageModeBtn.innerHTML = lightSvg;
  isDarkMode = true;
} else {
  document.documentElement.removeAttribute("data-bs-theme");
}
pageModeBtn.onclick = function () {
  isDarkMode = !isDarkMode;
  if (isDarkMode) {
    localStorage.theme = "dark";
    pageModeBtn.innerHTML = lightSvg;
    document.documentElement.setAttribute("data-bs-theme", "dark");
  } else {
    localStorage.theme = "light";
    pageModeBtn.innerHTML = darkSvg;
    document.documentElement.setAttribute("data-bs-theme", "light");
  }
};
// ========================Start========================

let allTasks = [];
let taskBtn = document.querySelector("button[type='submit']");
let inputValue = document.querySelector(".form-control");
let tasksContainer = document.querySelector(".list-group");

taskBtn.addEventListener("click", handelAddTask);

/**
 * |=====localStorage Check and load the existing tasks=====|
 */
if (localStorage.getItem("tasks")) {
  allTasks = JSON.parse(localStorage.getItem("tasks"));
  allTasks.forEach((task) => {
    addContentToDOM(task);
  });
}
/**
 * @param {Event} e  Function Adding Task and assign an object with dynamic values
 */
function handelAddTask(e) {
  e.preventDefault();
  if (inputValue.value !== "") {
    const taskObj = {
      id: Math.round(Math.random() * 10000),
      name: inputValue.value,
      complete: false,
    };
    addContentToDOM(taskObj); // adding to the DOM
    allTasks.push(taskObj); // adding to the all tasks object
    updateLocalStorage(allTasks); // adding to localStorage
    toaster(); // show notification
  }
}
/**
 * @param {object} taskObj this function receive a task object parameter
 * which hold all info about each task and build the html structure on site
 */
function addContentToDOM(taskObj) {
  const content = `
  <li class="list-group-item d-flex align-items-center" id="task-${
    taskObj.id
  }" >
    <div class="form-check flex-grow-1" onclick="handleCheckTask(${
      taskObj.id
    })">
      <input
        class="form-check-input"
        type="checkbox"
        value=""
        id="flexCheck${taskObj.id}"
        ${taskObj.complete ? "checked" : ""}
      />
      <label class="form-check-label w-100 fw-bold" id="label-${
        taskObj.id
      }" for="flexCheck${taskObj.id}">
        ${taskObj.name}
      </label>
    </div>
    <div class="controls d-flex gap-3">
      <button 
      class="btn edit" 
      title="Edit Task"
      data-bs-toggle="modal"
      data-bs-target="#editModal" 
      onclick="handelEditTask(${taskObj.id},'${taskObj.name}')"
      >
        <i class="fa-regular fa-pen-to-square fa-lg"></i>
      </button>
      <button 
      class="btn delete" 
      title="Delete Task"
      data-bs-toggle="modal"
      data-bs-target="#deleteModal" 
      onclick="handelDeleteTask(${taskObj.id})"
      >
        <i class="fa-solid fa-trash fa-lg"></i>
      </button>
    </div>
  </li>
`;
  inputValue.value = ""; // empty the value of the main input to have better UX
  tasksContainer.innerHTML += content; // get the previous content and add the next one
}
/**
 *
 * @param {number} taskObjID  get the the id of the clicked task element
 * @param {Array} allTasks the main array which hold all objects
 */

/**
 * |=====All handler functions (check , edit, delete)=====|
 */

function handleCheckTask(taskObjID) {
  let checkInput = document.getElementById(`flexCheck${taskObjID}`); // get the element to have control on the DOM
  allTasks.forEach((task) => {
    // loop over each task and edit the checked task info from the main task holder
    if (task.id === taskObjID) {
      task.complete = true; // update tasks array object
      if (checkInput.checked) {
        // another condition to check whether the input checked or not and therefore change task complete
        task.complete = true;
      } else {
        task.complete = false;
      }
    }
  });
  updateLocalStorage(allTasks); //updating localStorage
}

const confirmDelBtn = document.getElementById("confirm-del");
const confirmEditBtn = document.getElementById("confirm-edit");
const toastLiveExample = document.getElementById("liveToast");

function handelDeleteTask(taskObjID) {
  let removedTask = document.getElementById(`task-${taskObjID}`);
  confirmDelBtn.addEventListener("click", () => {
    removedTask.remove(); // remove item from the DOM
    allTasks = allTasks.filter((task) => task.id != taskObjID); // remove the clicked task from all task object
    updateLocalStorage(allTasks); // remove from localStorage
    toaster(); // show notification
  });
}
function handelEditTask(taskObjID, taskName) {
  let modalInput = document.getElementById("edit-input");
  let labelContent = document.getElementById(`label-${taskObjID}`);
  modalInput.value = taskName; // adding exist value to the input to change it
  confirmEditBtn.addEventListener("click", () => {
    allTasks.forEach((task) => {
      if (task.id === taskObjID) {
        task.name = modalInput.value; // updating value on the task object
      }
    });
    updateLocalStorage(allTasks); // updating localStorage
    labelContent.textContent = modalInput.value; // updating the DOM
    toaster(); // show success msg notification
  });
}
function toaster() {
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
  toastBootstrap.show();
}

function updateLocalStorage(allTasks) {
  localStorage.setItem("tasks", JSON.stringify(allTasks));
}
