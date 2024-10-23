class Task {
    constructor(id, description, completed = false) {
      this.id = id;
      this.description = description;
      this.completed = completed;
    }
  
    toggleComplete() {
      this.completed = !this.completed;
    }
  
    updateDescription(newDescription) {
      this.description = newDescription;
    }
  }
  
  class TaskList {
    constructor() {
      this.tasks = [];
    }
  
    addTask(description) {
      const id = this.tasks.length ? this.tasks[this.tasks.length - 1].id + 1 : 1;
      const task = new Task(id, description);
      this.tasks.push(task);
    }
  
    removeTask(id) {
      this.tasks = this.tasks.filter(task => task.id !== id);
    }
  
    getTaskById(id) {
      return this.tasks.find(task => task.id === id);
    }
  
    updateTask(id, newDescription) {
      const task = this.getTaskById(id);
      if (task) {
        task.updateDescription(newDescription);
      }
    }
  
    toggleTaskComplete(id) {
      const task = this.getTaskById(id);
      if (task) {
        task.toggleComplete();
      }
    }
  }
  
  class TaskView {
    constructor() {
      this.app = document.getElementById('app');
      this.form = document.createElement('form');
      this.input = document.createElement('input');
      this.input.type = 'text';
      this.input.placeholder = 'Add a new task...';
      this.form.appendChild(this.input);
      this.button = document.createElement('button');
      this.button.textContent = 'Add Task';
      this.form.appendChild(this.button);
      this.taskList = document.createElement('ul');
  
      this.app.appendChild(this.form);
      this.app.appendChild(this.taskList);
    }
  
    getTaskInput() {
      return this.input.value;
    }
  
    clearTaskInput() {
      this.input.value = '';
    }
  
    renderTasks(tasks) {
      this.taskList.innerHTML = '';
      tasks.forEach(task => {
        const li = document.createElement('li');
        li.dataset.id = task.id;
  
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => {
          this.onToggleComplete(task.id);
        });
  
        const span = document.createElement('span');
        span.textContent = task.description;
        span.contentEditable = true;
        span.addEventListener('input', () => {
          this.onEditTask(task.id, span.textContent);
        });
  
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Remove';
        deleteButton.addEventListener('click', () => {
          this.onRemoveTask(task.id);
        });
  
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteButton);
        this.taskList.appendChild(li);
      });
    }
  
    bindAddTask(handler) {
      this.form.addEventListener('submit', event => {
        event.preventDefault();
        if (this.input.value.trim()) {
          handler(this.input.value);
          this.clearTaskInput();
        }
      });
    }
  
    bindToggleComplete(handler) {
      this.onToggleComplete = handler;
    }
  
    bindEditTask(handler) {
      this.onEditTask = handler;
    }
  
    bindRemoveTask(handler) {
      this.onRemoveTask = handler;
    }
  }
  
  class TaskController {
    constructor(model, view) {
      this.model = model;
      this.view = view;
  
      this.view.bindAddTask(this.handleAddTask.bind(this));
      this.view.bindToggleComplete(this.handleToggleComplete.bind(this));
      this.view.bindEditTask(this.handleEditTask.bind(this));
      this.view.bindRemoveTask(this.handleRemoveTask.bind(this));
      this.renderTasks();
    }
  
    renderTasks() {
      this.view.renderTasks(this.model.tasks);
    }
  
    handleAddTask(description) {
      this.model.addTask(description);
      this.renderTasks();
    }
  
    handleToggleComplete(id) {
      this.model.toggleTaskComplete(id);
      this.renderTasks();
    }
  
    handleEditTask(id, newDescription) {
      this.model.updateTask(id, newDescription);
      this.renderTasks();
    }
  
    handleRemoveTask(id) {
      this.model.removeTask(id);
      this.renderTasks();
    }
  }

  const app = new TaskController(new TaskList(), new TaskView());

  