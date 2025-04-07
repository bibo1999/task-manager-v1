document.addEventListener('DOMContentLoaded', function() {
    const inviteForm = document.getElementById('inviteForm');

    inviteForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Get values from the form
        const name = document.getElementById('memberName').value;
        const initials = document.getElementById('memberInitials').value;
        const password = document.getElementById('memberPassword').value;
        const role = document.getElementById('memberRole').value;

        const token = localStorage.getItem('authToken'); // Assuming the JWT token is stored in localStorage

        if (!token) {
            alert("Please log in first.");
            window.location.href = "login.html";
            return;
        }

        // Prepare the data to send to the server
        const data = {
            name,
            initials,
            password,
            role
        };

        // Send the data to the server using fetch
        const response = await fetch('http://localhost:5000/api/members', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('User invited successfully');
            window.location.href = 'dashboard.html'; // Redirect to dashboard
        } else {
            const errorData = await response.json();
            alert(`Failed to invite user: ${errorData.message}`);
        }
    });
});
