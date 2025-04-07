/* ============================================= */
/*              MAIN APPLICATION SETUP           */
/* ============================================= */

// Wait for DOM to be fully loaded before executing script
document.addEventListener("DOMContentLoaded", function () {
    // =============================================
    //              VARIABLE DECLARATIONS
    // =============================================
    
    // DOM Elements
    const themeToggleButton = document.getElementById('themeToggle');
    const body = document.body;
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskFormContainer = document.getElementById('taskFormContainer');
    const taskForm = document.getElementById('taskForm');
    const tasksContainer = document.getElementById('tasksContainer');
    const totalTasks = document.getElementById('total-tasks');
    const inProgress = document.getElementById('in-progress');
    const completed = document.getElementById('completed');
    const notificationBell = document.getElementById('notificationBell');
    const notificationCount = document.getElementById('notificationCount');
    const notificationDropdown = document.getElementById('notificationDropdown');
    const notificationList = document.getElementById('notificationList');
    const clearBtn = document.getElementById('clearNotifications');

    // Data Storage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const NOTIFICATION_KEY = 'task_notifications';
    let notifications = JSON.parse(localStorage.getItem(NOTIFICATION_KEY)) || [];

    // =============================================
    //              THEME MANAGEMENT
    // =============================================
    
    // Initialize theme from localStorage or default to light
    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        themeToggleButton.querySelector('span').textContent = 'Dark';
        themeToggleButton.querySelector('i').classList.replace('fa-sun', 'fa-moon');
    }

    // Theme toggle event handler
    themeToggleButton.addEventListener('click', () => {
        const isDark = body.hasAttribute('data-theme');
        if (isDark) {
            body.removeAttribute('data-theme');
            themeToggleButton.querySelector('span').textContent = 'Light';
            themeToggleButton.querySelector('i').classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'light');
        } else {
            body.setAttribute('data-theme', 'dark');
            themeToggleButton.querySelector('span').textContent = 'Dark';
            themeToggleButton.querySelector('i').classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'dark');
        }
    });

    // =============================================
    //              TASK FORM MANAGEMENT
    // =============================================
    
    // Toggle task form visibility
    addTaskBtn.addEventListener('click', () => {
        taskFormContainer.classList.toggle('hidden');
    });

    // Handle task form submission
    taskForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Create new task object from form data
        const newTask = {
            id: Date.now(),
            title: document.getElementById('taskTitle').value,
            description: document.getElementById('taskDescription').value,
            date: document.getElementById('taskDate').value,
            priority: document.getElementById('taskPriority').value,
            assignee: document.getElementById('taskAssignee').value,
            status: "In Progress"
        };

        // Add task to storage and show notification
        tasks.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        addNotification(`Task "${newTask.title}" created`, 'success');
        
        // Reset form and update UI
        taskForm.reset();
        taskFormContainer.classList.add('hidden');
        renderTasks();
    });

    // =============================================
    //              TASK MANAGEMENT FUNCTIONS
    // =============================================
    
    /**
     * Updates the dashboard statistics counters
     */
    function updateTaskCount() {
        totalTasks.textContent = tasks.length;
        const inProgressTasks = tasks.filter(task => task.status === "In Progress").length;
        const completedTasks = tasks.filter(task => task.status === "Completed").length;
        inProgress.textContent = inProgressTasks;
        completed.textContent = completedTasks;
    }

    /**
     * Renders all tasks to the DOM
     */
    function renderTasks() {
        // Refresh tasks from localStorage
        tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasksContainer.innerHTML = '';

        // Show empty state if no tasks
        if (tasks.length === 0) {
            tasksContainer.innerHTML = '<p style="text-align:center; color: gray;">No tasks added yet.</p>';
        }

        // Create and append task elements
        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.classList.add('task-card');
            taskElement.innerHTML = `
                <h4>${task.title}</h4>
                <p>${task.description}</p>
                <p>Due: ${task.date} | Priority: ${task.priority} | Assignee: ${task.assignee}</p>
                <p>Status: ${task.status}</p>
                <button onclick="editTask(${task.id})">Edit</button>
                <button onclick="deleteTask(${task.id})">Delete</button>
                <button onclick="toggleStatus(${task.id})">${task.status === 'Completed' ? 'Mark In Progress' : 'Mark Completed'}</button>
            `;
            tasksContainer.appendChild(taskElement);
        });

        updateTaskCount();
    }

    // =============================================
    //              TASK CRUD OPERATIONS
    // =============================================
    
    /**
     * Populates form with task data for editing
     * @param {number} id - ID of task to edit
     */
    window.editTask = (id) => {
        const task = tasks.find((task) => task.id === id);
        document.getElementById('taskTitle').value = task.title;
        document.getElementById('taskDescription').value = task.description;
        document.getElementById('taskDate').value = task.date;
        document.getElementById('taskPriority').value = task.priority;
        document.getElementById('taskAssignee').value = task.assignee;
        taskFormContainer.classList.remove('hidden');
        deleteTask(id); // This removes the original task, we'll recreate it on form submit
    };

    /**
     * Deletes a task by ID
     * @param {number} id - ID of task to delete
     */
    window.deleteTask = (id) => {
        const task = tasks.find((task) => task.id === id);
        tasks = tasks.filter((task) => task.id !== id);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        addNotification(`Task "${task.title}" deleted`, 'danger');
        renderTasks();
    };

    /**
     * Toggles task status between Completed/In Progress
     * @param {number} id - ID of task to toggle
     */
    window.toggleStatus = (id) => {
        tasks = tasks.map(task => {
            if (task.id === id) {
                task.status = task.status === 'Completed' ? 'In Progress' : 'Completed';
                addNotification(
                    `Task "${task.title}" marked as ${task.status}`,
                    task.status === 'Completed' ? 'success' : 'info'
                );
            }
            return task;
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    };

    // =============================================
    //              NOTIFICATION SYSTEM
    // =============================================
    
    /**
     * Adds a new notification
     * @param {string} message - Notification content
     * @param {string} type - Notification type (success, danger, info)
     */
    function addNotification(message, type = 'info') {
        const notification = {
            id: Date.now(),
            message,
            type,
            timestamp: new Date().toISOString(),
            read: false
        };
        notifications.unshift(notification);
        localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(notifications));
        renderNotifications();
    }

    /**
     * Renders all notifications to the dropdown
     */
    function renderNotifications() {
        notifications = JSON.parse(localStorage.getItem(NOTIFICATION_KEY)) || [];
        notificationList.innerHTML = '';
        
        // Show empty state if no notifications
        if (notifications.length === 0) {
            notificationList.innerHTML = '<li>No notifications yet</li>';
        }

        // Create and append notification elements
        notifications.forEach(note => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="notification-type ${note.type}">
                    <i class="fas fa-${note.type === 'success' ? 'check-circle' : note.type === 'danger' ? 'trash' : 'info-circle'}"></i>
                </span>
                <span class="notification-message">${note.message}</span>
                <small>${new Date(note.timestamp).toLocaleString()}</small>
            `;
            li.dataset.id = note.id;
            if (!note.read) li.classList.add('unread');
            notificationList.appendChild(li);
        });

        updateNotificationCount();
    }

    /**
     * Updates the notification badge count
     */
    function updateNotificationCount() {
        const unreadCount = notifications.filter(n => !n.read).length;
        notificationCount.textContent = unreadCount;
        notificationCount.style.display = unreadCount > 0 ? 'inline-block' : 'none';
    }

    // Notification bell click handler
    notificationBell.addEventListener('click', () => {
        const isOpen = notificationDropdown.style.display === 'block';
        notificationDropdown.style.display = isOpen ? 'none' : 'block';
        
        // Mark all as read when dropdown is opened
        if (!isOpen) {
            notifications = notifications.map(n => ({ ...n, read: true }));
            localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(notifications));
            updateNotificationCount();
            renderNotifications();
        }
    });

    // Clear all notifications
    clearBtn.addEventListener('click', () => {
        notifications = [];
        localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(notifications));
        notificationDropdown.style.display = 'none';
        renderNotifications();
    });

    // =============================================
    //              INITIALIZATION
    // =============================================
    
    // Initial render of tasks and notifications
    renderTasks();
    renderNotifications();
});