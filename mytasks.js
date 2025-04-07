document.addEventListener("DOMContentLoaded", async function () {
    const token = localStorage.getItem('token');
    if (!token) return (window.location.href = 'login.html');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    const themeToggleButton = document.getElementById('themeToggle');
    const body = document.body;
    const tasksContainer = document.getElementById('tasksContainer');

    // Theme Toggle
    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        themeToggleButton.querySelector('span').textContent = 'Dark';
        themeToggleButton.querySelector('i').classList.replace('fa-sun', 'fa-moon');
    }
    themeToggleButton.addEventListener('click', () => {
        const isDark = body.getAttribute('data-theme') === 'dark';
        body.setAttribute('data-theme', isDark ? 'light' : 'dark');
        themeToggleButton.querySelector('span').textContent = isDark ? 'Light' : 'Dark';
        themeToggleButton.querySelector('i').classList.replace(isDark ? 'fa-moon' : 'fa-sun', isDark ? 'fa-sun' : 'fa-moon');
        localStorage.setItem('theme', isDark ? 'light' : 'dark');
    });

    // Fetch Tasks
    const response = await fetch('/api/tasks', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const tasks = await response.json();

    // Render Tasks
    tasksContainer.innerHTML = '';
    if (currentUser.role === 'admin') {
        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.classList.add('task-card');
            taskElement.innerHTML = `
                <h4>${task.title}</h4>
                <p>${task.description || ''}</p>
                <p>Due: ${task.date} | Priority: ${task.priority} | Assignee: ${task.assignee}</p>
                <p>Status: ${task.status}</p>
            `;
            tasksContainer.appendChild(taskElement);
        });
    } else {
        const myTasks = tasks.filter(task => task.assignee === currentUser.initials);
        myTasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.classList.add('task-card');
            taskElement.innerHTML = `
                <h4>${task.title}</h4>
                <p>${task.description || ''}</p>
                <p>Due: ${task.date} | Priority: ${task.priority}</p>
                <p>Status: ${task.status}</p>
                <button onclick="toggleStatus('${task._id}')">${task.status === 'Completed' ? 'Mark In Progress' : 'Mark Completed'}</button>
            `;
            tasksContainer.appendChild(taskElement);
        });
    }

    window.toggleStatus = async (id) => {
        const task = tasks.find(t => t._id === id);
        const newStatus = task.status === 'Completed' ? 'In Progress' : 'Completed';
        await fetch(`/api/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: newStatus })
        });
        window.location.reload(); // Refresh tasks
    };
});