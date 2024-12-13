const users = {
    user1: 'password1',
    user2: 'password2'
};

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (users[username] === password) {
        window.location.href = 'dashboard.html';
    } else {
        document.getElementById('error').textContent = 'Invalid credentials';
    }
});
