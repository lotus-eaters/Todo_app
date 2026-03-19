// Todo Management Functions

let todos = [];
let filteredTodos = [];
const PRIORITY_MAP = { 1: 'Low', 2: 'Medium', 3: 'High', 4: 'Urgent', 5: 'Critical' };

// Load all todos
async function loadTodos() {
  try {
    todos = await TodoAPI.getAllTodos();
    filteredTodos = [...todos];
    renderTodos();
  } catch (error) {
    showNotification(`Failed to load todos: ${error.message}`, 'error');
  }
}

// Add new todo
async function handleAddTodo(event) {
  event.preventDefault();

  const todoData = {
    title: document.getElementById('todo-title').value,
    description: document.getElementById('todo-description').value,
    priority: parseInt(document.getElementById('todo-priority').value),
    complete: false
  };

  try {
    await TodoAPI.createTodo(todoData);
    showNotification('Todo created successfully!', 'success');
    document.getElementById('todo-form').reset();
    loadTodos();
  } catch (error) {
    showNotification(`Failed to create todo: ${error.message}`, 'error');
  }
}

// Edit todo
async function editTodo(todoId) {
  const todo = todos.find(t => t.id === todoId);
  if (!todo) return;

  // Populate form with todo data
  document.getElementById('todo-title').value = todo.title;
  document.getElementById('todo-description').value = todo.description;
  document.getElementById('todo-priority').value = todo.priority;

  // Store the ID for update
  document.getElementById('todo-form').dataset.editId = todoId;

  // Change button text
  const submitBtn = document.querySelector('#todo-form button[type="submit"]');
  submitBtn.textContent = 'Update Todo';

  // Scroll to form
  document.getElementById('todo-form').scrollIntoView({ behavior: 'smooth' });
}

// Update todo
async function updateTodo(todoId, todoData) {
  try {
    await TodoAPI.updateTodo(todoId, todoData);
    showNotification('Todo updated successfully!', 'success');
    resetTodoForm();
    loadTodos();
  } catch (error) {
    showNotification(`Failed to update todo: ${error.message}`, 'error');
  }
}

// Delete todo
async function deleteTodo(todoId) {
  if (confirm('Are you sure you want to delete this todo?')) {
    try {
      await TodoAPI.deleteTodo(todoId);
      showNotification('Todo deleted successfully!', 'success');
      loadTodos();
    } catch (error) {
      showNotification(`Failed to delete todo: ${error.message}`, 'error');
    }
  }
}

// Toggle todo complete status
async function toggleTodoComplete(todoId) {
  const todo = todos.find(t => t.id === todoId);
  if (!todo) return;

  const updatedData = {
    title: todo.title,
    description: todo.description,
    priority: todo.priority,
    complete: !todo.complete
  };

  try {
    await updateTodo(todoId, updatedData);
  } catch (error) {
    showNotification(`Failed to toggle todo status: ${error.message}`, 'error');
  }
}

// Filter todos
function filterTodos(filterType = 'all') {
  switch (filterType) {
    case 'active':
      filteredTodos = todos.filter(t => !t.complete);
      break;
    case 'completed':
      filteredTodos = todos.filter(t => t.complete);
      break;
    case 'high-priority':
      filteredTodos = todos.filter(t => t.priority >= 4);
      break;
    default:
      filteredTodos = [...todos];
  }
  renderTodos();
  updateFilterButtons(filterType);
}

// Update filter button states
function updateFilterButtons(activeFilter) {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-filter="${activeFilter}"]`)?.classList.add('active');
}

// Sort todos
function sortTodos(sortBy) {
  switch (sortBy) {
    case 'priority':
      filteredTodos.sort((a, b) => b.priority - a.priority);
      break;
    case 'title':
      filteredTodos.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'newest':
      filteredTodos.reverse();
      break;
    case 'oldest':
      filteredTodos.sort((a, b) => a.id - b.id);
      break;
  }
  renderTodos();
}

// Render todos
function renderTodos() {
  const todosList = document.getElementById('todos-list');
  todosList.innerHTML = '';

  if (filteredTodos.length === 0) {
    todosList.innerHTML = '<div class="empty-state">No todos found. Create one to get started!</div>';
    return;
  }

  filteredTodos.forEach(todo => {
    const todoElement = createTodoElement(todo);
    todosList.appendChild(todoElement);
  });
}

// Create todo element
function createTodoElement(todo) {
  const div = document.createElement('div');
  div.className = `todo-item ${todo.complete ? 'completed' : ''} priority-${todo.priority}`;

  const priorityLabel = PRIORITY_MAP[todo.priority] || 'Unknown';

  div.innerHTML = `
    <div class="todo-header">
      <div class="todo-title-section">
        <input 
          type="checkbox" 
          class="todo-checkbox" 
          ${todo.complete ? 'checked' : ''}
          onchange="toggleTodoComplete(${todo.id})"
        />
        <h3 class="todo-title">${escapeHtml(todo.title)}</h3>
      </div>
      <span class="priority-badge priority-${todo.priority}">${priorityLabel}</span>
    </div>
    <p class="todo-description">${escapeHtml(todo.description)}</p>
    <div class="todo-actions">
      <button class="btn-edit" onclick="editTodo(${todo.id})">Edit</button>
      <button class="btn-delete" onclick="deleteTodo(${todo.id})">Delete</button>
    </div>
  `;

  return div;
}

// Reset todo form
function resetTodoForm() {
  document.getElementById('todo-form').reset();
  document.getElementById('todo-form').dataset.editId = '';
  const submitBtn = document.querySelector('#todo-form button[type="submit"]');
  submitBtn.textContent = 'Add Todo';
}

// Override form submission to handle edit vs create
document.addEventListener('DOMContentLoaded', function() {
  const todoForm = document.getElementById('todo-form');
  if (todoForm) {
    todoForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const editId = this.dataset.editId;
      const todoData = {
        title: document.getElementById('todo-title').value,
        description: document.getElementById('todo-description').value,
        priority: parseInt(document.getElementById('todo-priority').value),
        complete: false
      };

      if (editId) {
        // Update existing todo
        await updateTodo(parseInt(editId), todoData);
      } else {
        // Create new todo
        await handleAddTodo(e);
      }
    });
  }
});

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
