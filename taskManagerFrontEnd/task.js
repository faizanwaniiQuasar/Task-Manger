var jwt = localStorage.getItem("token");

var token = jwt.split(".");

const { name: userName } = JSON.parse(atob(token[1]));

fetch("http://127.0.0.1:3000/api/v1/tasks", {
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("token"),
  },
})
  .then((response) => response.json())
  .then((data) => {
    const showUsername = document.querySelector(".showUser");
    showUsername.textContent = " Asalaam Alaikum, " + userName;
    data.data.tasks.forEach((task) => {
      //html dynamic elements
      const displayTask = document.querySelector("#list-container");
      const cardLi = document.createElement("div");
      const outerClass = document.createElement("div");
      const buttonClass = document.createElement("div");
      const taskName = document.createElement("div");
      const taskDesc = document.createElement("div");
      const updateTask = document.createElement("button");
      const deleteTask = document.createElement("button");
      const updateIcon = document.createElement("i");
      const deleteIcon = document.createElement("i");
      // const completed = document.querySelector();
      deleteIcon.setAttribute("data-taskId", task._id);
      updateIcon.setAttribute("data-taskId-update", task._id);
      if (task.completed) {
        taskName.classList.add("taskNameCompleted");
      }
      //1. class name for html tags
      cardLi.classList.add("card");
      taskName.classList.add("taskName");
      taskDesc.classList.add("taskDesc");
      updateTask.classList.add("updateButton");
      deleteTask.classList.add("deleteButton");
      outerClass.classList.add("outerClass");
      buttonClass.classList.add("buttonClass");
      updateIcon.classList.add("fa-pen-to-square");
      updateIcon.classList.add("fa-regular");
      updateIcon.classList.add("updateIcon");
      deleteIcon.classList.add("fa-solid");
      deleteIcon.classList.add("fa-trash");
      deleteIcon.classList.add("deleteIcon");

      //2. append items
      taskName.textContent = task.name;
      taskDesc.textContent = task.description;
      displayTask.appendChild(cardLi);

      cardLi.appendChild(outerClass);
      outerClass.appendChild(taskName);
      outerClass.appendChild(buttonClass);
      buttonClass.appendChild(updateTask);
      updateTask.appendChild(updateIcon);
      buttonClass.appendChild(deleteTask);
      deleteTask.appendChild(deleteIcon);
      cardLi.appendChild(taskDesc);

      //   console.log(task.completed);
    });
  })
  .catch((err) => {
    console.log(err.message);
  });

const createTask = async (task) => {
  // console.log(task.name);
  const response = await fetch("http://127.0.0.1:3000/api/v1/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    body: JSON.stringify(task),
  });
  const data = await response.json();
  console.log(data);
};

const taskForm = document.getElementById("taskFormAdd");
const body = document.querySelector("body");
body.addEventListener("click", (e) => {
  if (e.target.classList.contains("taskModal")) {
    updateTaskModal.close();
  }
  // if (!updateTaskModal) {
  //   updateTaskModal.close();
  // }
});

taskForm.addEventListener("submit", async (e) => {
  //   e.preventDefault();

  const taskName = taskForm.taskName.value;
  const taskDesc = taskForm.taskDesc.value;

  const task = {
    name: taskName,
    description: taskDesc,
  };

  await createTask(task);
});

//to store task id
const deleteTask = async (taskId) => {
  const response = await fetch(`http://127.0.0.1:3000/api/v1/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });
  const data = await response.json();
  console.log(data);
};

let updatedTaskId = "";
const updateTaskModal = document.querySelector("#editModal");
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("deleteIcon")) {
    const taskId = e.target.getAttribute("data-taskId");
    deleteTask(taskId);
    window.location.reload();
  }
  if (e.target.classList.contains("updateIcon")) {
    updateTaskModal.showModal();
    updatedTaskId = e.target.getAttribute("data-taskId-update");
    fetch(`http://127.0.0.1:3000/api/v1/tasks/${updatedTaskId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data.data.task);
        updateTaskModal.querySelector("#updateName").value =
          data.data.task.name;
        updateTaskModal.querySelector("#updateDesc").value =
          data.data.task.description;
        updateTaskModal.querySelector("#updateCheck").checked =
          data.data.task.completed;
      });
  }
});

const updatedForm = document.getElementById("updateForm");
const updated = async (task) => {
  const response = await fetch(
    `http://127.0.0.1:3000/api/v1/tasks/${updatedTaskId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(task),
    }
  );
  const data = await response.json();
};
updatedForm.addEventListener("submit", async (e) => {
  // e.preventDefault();
  const nameUpdated = updatedForm.taskNameUpdated.value;
  const descUpdated = updatedForm.updateDescTask.value;
  const compltedUpdated = updatedForm.completedTask.checked;
  console.log(compltedUpdated);
  const task = {
    name: nameUpdated,
    description: descUpdated,
    completed: compltedUpdated,
  };

  await updated(task);
});

//logout

const logOut = document.querySelector("#logout");
logOut.addEventListener("click", async (e) => {
  e.preventDefault();
  localStorage.removeItem("token");
  // console.log(localStorage.getItem("token"));
  window.location.replace("login.html");
});
