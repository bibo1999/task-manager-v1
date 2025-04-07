document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginError = document.getElementById('loginError');
    const registerError = document.getElementById('registerError');
    const toggleAuth = document.getElementById('toggleAuth');
    const authTitle = document.getElementById('authTitle');
    let isLogin = true;

    toggleAuth.addEventListener('click', (e) => {
        e.preventDefault();
        isLogin = !isLogin;
        loginForm.classList.toggle('hidden');
        registerForm.classList.toggle('hidden');
        authTitle.textContent = isLogin ? 'TaskSync Login' : 'TaskSync Register';
        toggleAuth.textContent = isLogin ? 'Need an account? Register' : 'Already have an account? Login';
        loginError.classList.add('hidden');
        registerError.classList.add('hidden');
    });

    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const username = document.getElementById('username').value.toUpperCase();
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ initials: username, password })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('currentUser', JSON.stringify(data.user));
                window.location.href = data.user.role === 'admin' ? 'index.html' : 'mytasks.html';
            } else {
                loginError.textContent = data.message;
                loginError.classList.remove('hidden');
            }
        } catch (err) {
            loginError.textContent = 'Network error';
            loginError.classList.remove('hidden');
        }
    });

    registerForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const name = document.getElementById('regName').value;
        const initials = document.getElementById('regInitials').value.toUpperCase();
        const password = document.getElementById('regPassword').value;

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, initials, role: 'worker', password })
            });
            const data = await response.json();
            if (response.ok) {
                alert('Registration successful! Please log in.');
                toggleAuth.click(); // Switch back to login
                registerForm.reset();
            } else {
                registerError.textContent = data.message;
                registerError.classList.remove('hidden');
            }
        } catch (err) {
            registerError.textContent = 'Network error';
            registerError.classList.remove('hidden');
        }
    });
});