document.addEventListener("DOMContentLoaded", function () {
    // Existing variable declarations
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

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const NOTIFICATION_KEY = 'task_notifications';
    let notifications = JSON.parse(localStorage.getItem(NOTIFICATION_KEY)) || [];

    // Existing theme toggle logic (unchanged)
    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        themeToggleButton.querySelector('span').textContent = 'Dark';
        themeToggleButton.querySelector('i').classList.replace('fa-sun', 'fa-moon');
    }

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

    // Toggle task form visibility
    addTaskBtn.addEventListener('click', () => {
        taskFormContainer.classList.toggle('hidden');
    });

    // Add Task with notification
    taskForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const newTask = {
            id: Date.now(),
            title: document.getElementById('taskTitle').value,
            description: document.getElementById('taskDescription').value,
            date: document.getElementById('taskDate').value,
            priority: document.getElementById('taskPriority').value,
            assignee: document.getElementById('taskAssignee').value,
            status: "In Progress"
        };

        tasks.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        addNotification(`Task "${newTask.title}" created`, 'success');
        taskForm.reset();
        taskFormContainer.classList.add('hidden');
        renderTasks();
    });

    // Update Dashboard Stats
    function updateTaskCount() {
        totalTasks.textContent = tasks.length;
        const inProgressTasks = tasks.filter(task => task.status === "In Progress").length;
        const completedTasks = tasks.filter(task => task.status === "Completed").length;
        inProgress.textContent = inProgressTasks;
        completed.textContent = completedTasks;
    }

    // Render Tasks
    function renderTasks() {
        tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasksContainer.innerHTML = '';

        if (tasks.length === 0) {
            tasksContainer.innerHTML = '<p style="text-align:center; color: gray;">No tasks added yet.</p>';
        }

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

    // Edit Task
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

    // Delete Task with notification
    window.deleteTask = (id) => {
        const task = tasks.find((task) => task.id === id);
        tasks = tasks.filter((task) => task.id !== id);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        addNotification(`Task "${task.title}" deleted`, 'danger');
        renderTasks();
    };

    // Toggle Task Status with notification
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

    // Notification Functions
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

    function renderNotifications() {
        notifications = JSON.parse(localStorage.getItem(NOTIFICATION_KEY)) || [];
        notificationList.innerHTML = '';
        
        if (notifications.length === 0) {
            notificationList.innerHTML = '<li>No notifications yet</li>';
        }

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

    function updateNotificationCount() {
        const unreadCount = notifications.filter(n => !n.read).length;
        notificationCount.textContent = unreadCount;
        notificationCount.style.display = unreadCount > 0 ? 'inline-block' : 'none';
    }

    // Notification Bell Click Handler
    notificationBell.addEventListener('click', () => {
        const isOpen = notificationDropdown.style.display === 'block';
        notificationDropdown.style.display = isOpen ? 'none' : 'block';
        
        if (!isOpen) {
            // Mark all as read when opened
            notifications = notifications.map(n => ({ ...n, read: true }));
            localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(notifications));
            updateNotificationCount();
            renderNotifications();
        }
    });

    // Clear Notifications
    clearBtn.addEventListener('click', () => {
        notifications = [];
        localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(notifications));
        notificationDropdown.style.display = 'none';
        renderNotifications();
    });

    // Initial render
    renderTasks();
    renderNotifications();
});
document.addEventListener('DOMContentLoaded', function() {
    const inviteButton = document.getElementById('inviteTeamMember');

    inviteButton.addEventListener('click', function() {
        window.location.href = 'newuser.html'; // Redirect to the newuser.html page
    });
});
// add new script for dynamic fetch for the members :
// This function loads team members from the API
async function loadTeamMembers() {
    try {
        console.log('Fetching team members from API...');
        
        // Check if token exists
        const token = localStorage.getItem('authToken');
        
        // For development testing without proper authentication
        // If you don't have authentication set up yet, you can create an endpoint that doesn't require auth
        let apiUrl = '/api/member';
        let headers = {
            'Content-Type': 'application/json'
        };
        
        // Add authentication if token exists
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        // Make the API call
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: headers
        });
        
        console.log('API Response Status:', response.status);
        
        // Check if response is OK (status in the range 200-299)
        if (response.ok) {
            const data = await response.json();
            console.log('Members data received:', data);
            
            // Validate that we received an array
            if (Array.isArray(data)) {
                populateTeamMembers(data);
                populateTaskAssigneeDropdown(data);
            } else {
                console.error('API returned data in unexpected format:', data);
                fallbackToDefaultMembers();
            }
        } else {
            // Handle error response
            const errorText = await response.text();
            console.error(`API Error (${response.status}):`, errorText);
            
            // Fall back to default members for now
            fallbackToDefaultMembers();
        }
    } catch (error) {
        console.error('Error fetching team members:', error);
        fallbackToDefaultMembers();
    }
}

// Fallback function when API call fails
function fallbackToDefaultMembers() {
    console.warn('Using fallback member data');
    const fallbackMembers = [
        { name: "Abdelrahman Moataz", initials: "AM", role: "Developer" },
        { name: "Test User", initials: "TU", role: "Tester" }
    ];
    populateTeamMembers(fallbackMembers);
    populateTaskAssigneeDropdown(fallbackMembers);
}

// Function to initialize team members - call this when the DOM is loaded
function initializeTeamMembers() {
    console.log('Initializing team members');
    loadTeamMembers();
}

// Call initialization when DOM is ready
document.addEventListener("DOMContentLoaded", function() {
    console.log('DOM fully loaded');
    initializeTeamMembers();
});

// // This function loads team members from the API
// async function loadTeamMembers() {
//     try {
//         const token = localStorage.getItem('authToken');
        
//         // For testing without authentication, you can use this commented code
//         // const dummyMembers = [
//         //     { name: "Abdelrahman Moataz", initials: "AM", role: "Developer" },
//         //     { name: "Test User", initials: "TU", role: "Tester" }
//         // ];
//         // populateTeamMembers(dummyMembers);
//         // populateTaskAssigneeDropdown(dummyMembers);
//         // return;
        
//         // Check if token exists
//         if (!token) {
//             console.error('No authentication token found');
//             return;
//         }
        
//         // Log before fetch to verify execution
//         console.log('Fetching team members...');
        
//         const response = await fetch('/api/member', {
//             method: 'GET',
//             headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': 'application/json'
//             }
//         });
        
//         console.log('API Response Status:', response.status);
        
//         const responseBody = await response.text();
//         console.log('Response body:', responseBody);
        
//         if (response.ok) {
//             try {
//                 const members = JSON.parse(responseBody);
//                 console.log('Parsed members:', members);
//                 populateTeamMembers(members);
//                 populateTaskAssigneeDropdown(members);
//             } catch (err) {
//                 console.error('Failed to parse response as JSON:', err);
//             }
//         } else {
//             console.error(`Failed to load team members: ${response.status} ${response.statusText}`);
//         }
//     } catch (error) {
//         console.error('Error fetching team members:', error);
//     }
// }

// // This function populates the team members sidebar
// function populateTeamMembers(members) {
//     console.log('Populating team members sidebar with:', members);
    
//     const teamMembersContainer = document.querySelector('.team-members');
//     if (!teamMembersContainer) {
//         console.error('Team members container not found in the DOM');
//         return;
//     }
    
//     // Save the header
//     const headerDiv = teamMembersContainer.querySelector('div:first-child');
    
//     // Clear existing content
//     teamMembersContainer.innerHTML = '';
    
//     // Add back the header
//     teamMembersContainer.appendChild(headerDiv);
    
//     // Add each member
//     members.forEach(member => {
//         // Create the member initials circle
//         const memberCircle = document.createElement('div');
//         memberCircle.className = 'team-member';
//         memberCircle.textContent = member.initials;
        
//         // Assign a color based on the member's initials
//         const colors = ['#6366F1', '#8B5CF6', '#EC4899', '#F43F5E', '#F97316', '#EAB308'];
//         const colorIndex = member.name.charCodeAt(0) % colors.length;
//         memberCircle.style.backgroundColor = colors[colorIndex];
        
//         // Create the member name span
//         const memberName = document.createElement('span');
//         memberName.textContent = member.name;
        
//         // Add elements to the container
//         teamMembersContainer.appendChild(memberCircle);
//         teamMembersContainer.appendChild(memberName);
//     });
// }

// // This function populates the assignee dropdown
// function populateTaskAssigneeDropdown(members) {
//     console.log('Populating task assignee dropdown with:', members);
    
//     const assigneeDropdown = document.getElementById('taskAssignee');
//     if (!assigneeDropdown) {
//         console.error('Task assignee dropdown not found in the DOM');
//         return;
//     }
    
//     // Clear existing options except for the default
//     assigneeDropdown.innerHTML = '<option value="" disabled selected>Assign Task To</option>';
    
//     // Add each member as an option
//     members.forEach(member => {
//         const option = document.createElement('option');
//         option.value = member.initials;
//         option.textContent = member.name;
//         assigneeDropdown.appendChild(option);
//     });
// }

// // Immediately-invoked function to ensure code runs whether DOM is loaded or not
// (function() {
//     // Add event listener for when DOM is fully loaded
//     document.addEventListener("DOMContentLoaded", function() {
//         console.log('DOM fully loaded');
//         initializeTeamMembers();
//     });
    
//     // Also try to run initialization if DOM might already be loaded
//     if (document.readyState === 'complete' || document.readyState === 'interactive') {
//         console.log('DOM already loaded, initializing');
//         initializeTeamMembers();
//     }
// })();

// // Function to initialize team members
// function initializeTeamMembers() {
//     console.log('Initializing team members');
    
//     // Check for auth token
//     const token = localStorage.getItem('authToken');
    
//     if (token) {
//         console.log('Auth token found, loading team members');
//         loadTeamMembers();
//     } else {
//         console.log('No auth token found, using fallback data for testing');
//         // For testing without authentication
//         const dummyMembers = [
//             { name: "Abdelrahman Moataz", initials: "AM", role: "Developer" },
//             { name: "Test", initials: "TU", role: "Tester" }
//         ];
//         populateTeamMembers(dummyMembers);
//         populateTaskAssigneeDropdown(dummyMembers);
//     }
// }