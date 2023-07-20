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

  function editTask(task, taskTextElement) {
    var currentText = task.text;
    var editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.value = currentText;
  
    editInput.addEventListener('blur', function() {
      task.text = editInput.value.trim();
      if (task.text !== '') {
        taskTextElement.textContent = task.text;
        saveTasks();
      } else {
        removeTask(taskTextElement.parentElement);
      }
    });
  
    editInput.addEventListener('keypress', function(event) {
      if (event.keyCode === 13) {
        task.text = editInput.value.trim();
        if (task.text !== '') {
          taskTextElement.textContent = task.text;
          saveTasks();
        } else {
          removeTask(taskTextElement.parentElement);
        }
      }
    });
  
    taskTextElement.textContent = '';
    taskTextElement.appendChild(editInput);
    editInput.focus();
  }
  
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
    var previousIndex = -1; // Initialize the previous index to -1

    checkbox.addEventListener('change', function() {
      task.completed = checkbox.checked;
      if (task.completed) {
        taskItem.classList.add('completed');
        tasksList.removeChild(taskItem);
        completedTasksList.appendChild(taskItem);
      } else {
        taskItem.classList.remove('completed');
        completedTasksList.removeChild(taskItem);
        tasksList.insertBefore(taskItem, tasksList.children[previousIndex + 1]);
      }
      saveTasks();
    });
  
    var taskText = document.createElement('span');
    taskText.textContent = task.text;
  
    var editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', function() {
      editTask(task, taskText);
    });
  
    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function() {
      removeTask(taskItem);
    });
  
    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskText);
    taskItem.appendChild(editButton);
    taskItem.appendChild(deleteButton);
    if (task.completed) {
      taskItem.classList.add('completed');
      completedTasksList.appendChild(taskItem);
    } else {
      tasksList.appendChild(taskItem);
    }
  }

  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(savedTasks));
  }

  function removeTask(taskItem) {
    var taskText = taskItem.querySelector('span').textContent;
    savedTasks = savedTasks.filter(function(task) {
      return task.text !== taskText;
    });
    saveTasks();
    taskItem.remove();
  }
  
});
