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
    //              CHART RENDERING
    // =============================================
    
    /**
     * Renders all data visualization charts
     */
    function renderCharts() {
        // Status Distribution (Pie Chart)
        const statusData = {
            labels: ['In Progress', 'Completed'],
            datasets: [{
                data: [
                    tasks.filter(t => t.status === 'In Progress').length,
                    tasks.filter(t => t.status === 'Completed').length
                ],
                backgroundColor: ['#F59E0B', '#10B981'] // Orange for in progress, green for completed
            }]
        };
        new Chart(document.getElementById('statusChart'), {
            type: 'pie',
            data: statusData,
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });

        // Priority Breakdown (Doughnut Chart)
        const priorityData = {
            labels: ['Low', 'Medium', 'High'],
            datasets: [{
                data: [
                    tasks.filter(t => t.priority === 'Low').length,
                    tasks.filter(t => t.priority === 'Medium').length,
                    tasks.filter(t => t.priority === 'High').length
                ],
                backgroundColor: ['#3B82F6', '#F59E0B', '#EF4444'] // Blue, orange, red
            }]
        };
        new Chart(document.getElementById('priorityChart'), {
            type: 'doughnut',
            data: priorityData,
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });

        // Tasks by Assignee (Bar Chart)
        const assignees = [...new Set(tasks.map(t => t.assignee))];
        const assigneeData = {
            labels: assignees,
            datasets: [{
                label: 'Tasks',
                data: assignees.map(a => tasks.filter(t => t.assignee === a).length),
                backgroundColor: '#6366F1' // Primary brand color
            }]
        };
        new Chart(document.getElementById('assigneeChart'), {
            type: 'bar',
            data: assigneeData,
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });

        // Task Completion Over Time (Line Chart)
        const dates = [...new Set(tasks.map(t => t.date))].sort();
        const timeData = {
            labels: dates,
            datasets: [{
                label: 'Completed Tasks',
                data: dates.map(d => tasks.filter(t => t.date === d && t.status === 'Completed').length),
                borderColor: '#10B981', // Success color
                fill: false
            }]
        };
        new Chart(document.getElementById('timeChart'), {
            type: 'line',
            data: timeData,
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }

    // =============================================
    //              INITIALIZATION
    // =============================================
    
    // Initial render of notifications and charts
    renderNotifications();
    renderCharts();
});