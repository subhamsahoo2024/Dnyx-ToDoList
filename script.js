let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";
let editId = null;

//save tasks
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

//add task
function addTask() {
  const taskInput = document.getElementById("taskInput");
  const text = taskInput.value.trim();
  if (text === "") return;

  tasks.push({
    id: Date.now(),
    text,
    completed: false,
  });
  
  taskInput.value = "";
  saveTasks();
  renderTasks();
}

//completing task
function toggleTask(id) {
  tasks = tasks.map((t) =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  saveTasks();
  renderTasks();
}

//deleting task
function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  renderTasks();
}

//editing Functions
function openEditModal(id, oldText) {
  editId = id;
  document.getElementById("editInput").value = oldText;

  const modal = document.getElementById("editModal");
  const box = document.getElementById("editModalBox");

  modal.classList.remove("hidden");

  setTimeout(() => {
    box.classList.remove("opacity-0", "scale-90");
    box.classList.add("opacity-100", "scale-100");
  }, 10);
}

function closeEditModal() {
  const modal = document.getElementById("editModal");
  const box = document.getElementById("editModalBox");

  box.classList.add("opacity-0", "scale-90");
  box.classList.remove("opacity-100", "scale-100");

  setTimeout(() => modal.classList.add("hidden"), 200);
}

function saveEdit() {
  const newText = document.getElementById("editInput").value.trim();
  if (newText === "") return;

  tasks = tasks.map((t) => (t.id === editId ? { ...t, text: newText } : t));

  saveTasks();
  closeEditModal();
  renderTasks();
}

// Render Tasks
function renderTasks() {
  const ul = document.getElementById("taskList");
  ul.innerHTML = "";

  const searchText = document.getElementById("searchInput").value.toLowerCase();

  const filteredTasks = tasks.filter((task) => {
    if (!task.text.toLowerCase().includes(searchText)) return false;

    if (currentFilter === "pending") return !task.completed;
    if (currentFilter === "completed") return task.completed;

    return true;
  }).reverse();

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");

    li.className =
      "flex justify-between p-3 bg-gray-700 rounded-lg transform transition-all duration-300 opacity-0 translate-y-9";

    setTimeout(() => {
      li.classList.remove("opacity-0", "translate-y-9");
    }, 100);

    li.innerHTML = `
      <div class="flex items-center">
        <input type="checkbox" class="mr-3"
               ${task.completed ? "checked" : ""}
               onclick="toggleTask(${task.id})">
        <span class="${task.completed ? "text-green-400" : ""}">
          ${task.text}
        </span>
      </div>

      <div class="space-x-2">
        <button onclick="openEditModal(${task.id}, '${task.text.replace(
      /'/g,
      "\\'"
    )}')" 
                class="text-blue-400 p-1 hover:bg-blue-400 rounded-lg hover:text-white ">Edit</button>
        <button onclick="deleteTask(${task.id})" 
                class="text-red-400 p-1 hover:bg-red-400 rounded-lg hover:text-white">Delete</button>
      </div>
    `;

    ul.appendChild(li);
  });
}

document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    document.querySelectorAll(".filter-btn").forEach(b => {
      b.classList.remove("bg-blue-400", "hover:bg-blue-600");
      b.classList.add("bg-gray-700", "hover:bg-gray-600");
    });

    btn.classList.remove("bg-gray-700", "hover:bg-gray-600");
    btn.classList.add("bg-blue-400", "hover:bg-blue-600");
    renderTasks();
  });
});

renderTasks();

