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
      var task = { text: taskText, completed: false, originalIndex: savedTasks.length };
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
      completedTasksList.appendChild(taskItem);
    } else {
      tasksList.appendChild(taskItem);
    }

    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    task.originalIndex = savedTasks.length - 1; // Store the original index when the task is rendered

    checkbox.addEventListener('change', function() {
      task.completed = checkbox.checked;
      if (task.completed) {
        taskItem.classList.add('completed');
        tasksList.removeChild(taskItem);
        completedTasksList.appendChild(taskItem);
      } else {
        taskItem.classList.remove('completed');
        completedTasksList.removeChild(taskItem);

        var taskIndex = savedTasks.indexOf(task);
        var originalIndex = task.originalIndex;
        if (taskIndex > originalIndex) {
          tasksList.insertBefore(taskItem, tasksList.children[originalIndex + 1]);
        } else {
          tasksList.insertBefore(taskItem, tasksList.children[originalIndex]);
        }
      }
      saveTasks();
    });

  
    var taskText = document.createElement('span');
    taskText.textContent = task.text;
  
    var editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', function() {
      editTask(task, taskText);
    },
    editButton.textContent = 'Edit',
    editButton.style.backgroundColor = '#4285f4',
    editButton.style.color = '#ffffff',
    editButton.style.padding = '5px 10px',
    editButton.style.margin = '5px',
    editButton.style.border = 'none',
    editButton.style.cursor = 'pointer',
    editButton.style.borderRadius = '3px',
    editButton.style.fontFamily = 'Arial, sans-serif',
    
    );
  
    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function() {
      removeTask(taskItem);
    },
    deleteButton.textContent = 'Delete',
    deleteButton.style.backgroundColor = '#f44336',
    deleteButton.style.color = '#ffffff',
    deleteButton.style.padding = '5px 10px',
    deleteButton.style.margin = '5px',
    deleteButton.style.border = 'none',
    deleteButton.style.cursor = 'pointer',
    deleteButton.style.borderRadius = '3px',
    deleteButton.style.fontFamily = 'Arial, sans-serif',
    );
  
    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskText);
    taskItem.appendChild(editButton);
    taskItem.appendChild(deleteButton);
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
