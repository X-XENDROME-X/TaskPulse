document.addEventListener('DOMContentLoaded', function() {
  var taskInput = document.getElementById('taskInput');
  var addTaskBtn = document.getElementById('addTaskBtn');
  var clearAllBtn = document.getElementById('clearAllBtn');
  var tasksList = document.getElementById('tasks');
  var completedTasksList = document.getElementById('completedTasks');

  // Load saved tasks from local storage
  var savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

  // Render the saved tasks
  savedTasks.forEach(renderTask);

  addTaskBtn.addEventListener('click', function() {
    var taskText = taskInput.value.trim();
    if (taskText !== '') {
      var task = { text: taskText, completed: false };
      renderTask(task);
      savedTasks.push(task);
      saveTasks();
      taskInput.value = '';
    }
  });

  clearAllBtn.addEventListener('click', function() {
    tasksList.innerHTML = ''; // Clear all tasks from the list
    completedTasksList.innerHTML = ''; // Clear all completed tasks from the list
    savedTasks = []; // Clear all tasks from the savedTasks array
    saveTasks();
  });

  taskInput.addEventListener('keypress', function(event) {
    if (event.keyCode === 13) {
      var taskText = taskInput.value.trim();
      if (taskText !== '') {
        var task = { text: taskText, completed: false };
        renderTask(task);
        savedTasks.push(task);
        saveTasks();
        taskInput.value = '';
      }
    }
  });

  function renderTask(task) {
    var taskItem = document.createElement('li');
    taskItem.classList.add('taskItem');
    if (task.completed) {
      taskItem.classList.add('completed');
    }

    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', function() {
      task.completed = checkbox.checked;
      taskItem.classList.toggle('completed');
      saveTasks();
      removeTask(taskItem);
    });

    var taskText = document.createElement('span');
    taskText.textContent = task.text;

    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskText);
    tasksList.appendChild(taskItem);
  }

  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(savedTasks));
  }

  function removeTask(taskItem) {
    savedTasks = savedTasks.filter(function(task) {
      return task.text !== taskItem.textContent;
    });
    saveTasks();
    taskItem.remove();
  }
});
