document.addEventListener('DOMContentLoaded', () => {
    const userData = JSON.parse(localStorage.getItem('userData')) || {
        admin: { username: 'admin', password: 'adminpass', name: 'Admin', address: 'Admin Address', email: 'admin@example.com' },
        waiter: { username: 'waiter', password: 'waiterpass', name: 'Waiter', address: 'Waiter Address', email: 'waiter@example.com' },
        users: {}
    };

    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    const menu = JSON.parse(localStorage.getItem('menu')) || [];

    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const orderForm = document.getElementById('orderForm');
    const adminUserTable = document.getElementById('adminUserTable');
    const orderTable = document.getElementById('adminOrderTable');
    const userOrderTable = document.getElementById('userOrderTable');
    const waiterOrderTable = document.getElementById('waiterOrderTable');
    const menuForm = document.getElementById('menuForm');
    const menuTable = document.getElementById('menuTable');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (username === 'admin' && password === 'adminpass') {
                localStorage.setItem('currentUser', 'admin');
                window.location.href = 'admin.html';
            } else if (username === 'waiter' && password === 'waiterpass') {
                localStorage.setItem('currentUser', 'waiter');
                window.location.href = 'waiter.html'; // Redirect to waiter interface
            } else if (userData.users[username] && userData.users[username].password === password) {
                localStorage.setItem('currentUser', username);
                window.location.href = 'user.html';
            } else {
                document.getElementById('errorMessage').innerText = 'Invalid username or password';
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('signupUsername').value;
            const password = document.getElementById('signupPassword').value;
            const name = document.getElementById('name').value;
            const address = document.getElementById('address').value;
            const email = document.getElementById('email').value;

            if (userData.users[username]) {
                document.getElementById('signupMessage').innerText = 'Username already exists';
            } else {
                userData.users[username] = { username, password, name, address, email };
                localStorage.setItem('userData', JSON.stringify(userData));
                document.getElementById('signupMessage').innerText = 'Sign up successful! You can now log in.';
                // Automatically log in the newly signed-up user
                localStorage.setItem('currentUser', username);
                window.location.href = 'user.html';
            }
        });
    }

    if (orderForm) {
        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const dish1 = parseInt(document.getElementById('dish1').value, 10) || 0;
            const dish2 = parseInt(document.getElementById('dish2').value, 10) || 0;
            const dish3 = parseInt(document.getElementById('dish3').value, 10) || 0;
            const currentUser = localStorage.getItem('currentUser');

            const newOrder = {
                user: currentUser,
                items: [
                    { name: 'Dish 1', quantity: dish1 },
                    { name: 'Dish 2', quantity: dish2 },
                    { name: 'Dish 3', quantity: dish3 }
                ],
                total: dish1 * 10 + dish2 * 15 + dish3 * 20,
                date: new Date().toLocaleString()
            };

            orders.push(newOrder);
            localStorage.setItem('orders', JSON.stringify(orders));
            populateOrderTable(userOrderTable, [newOrder]); // Populate only the new order
        });
    }

    // Function to populate order table
    const populateOrderTable = (table, orderData) => {
        table.innerHTML = '';
        orderData.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.user}</td>
                <td>${order.items.map(item => `${item.name} (${item.quantity})`).join(', ')}</td>
                <td>${order.total}</td>
                <td>${order.date}</td>
            `;
            table.appendChild(row);
        });
    };

    // Function to populate menu table
    const populateMenuTable = (table, menuData) => {
        table.innerHTML = '';
        menuData.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item}</td>
                <td><button class="deleteBtn" data-item="${item}">Delete</button></td>
            `;
            table.appendChild(row);
        });
        document.querySelectorAll('.deleteBtn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const item = e.target.dataset.item;
                const index = menu.indexOf(item);
                if (index > -1) {
                    menu.splice(index, 1);
                    localStorage.setItem('menu', JSON.stringify(menu));
                    populateMenuTable(menuTable, menu);
                }
            });
        });
    };

    // Populate order and menu tables on load
    if (orderTable) {
        populateOrderTable(orderTable, orders);
    }
    if (userOrderTable) {
        const currentUser = localStorage.getItem('currentUser');
        const userOrders = orders.filter(order => order.user === currentUser);
        populateOrderTable(userOrderTable, userOrders);
    }
    if (waiterOrderTable) {
        const clientOrders = orders.filter(order => userData.users.hasOwnProperty(order.user));
        populateOrderTable(waiterOrderTable, clientOrders);
    }
    if (menuTable) {
        populateMenuTable(menuTable, menu);
    }

    // Handle menu form submission
    if (menuForm) {
        menuForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newItem = document.getElementById('menuItem').value;
            menu.push(newItem);
            localStorage.setItem('menu', JSON.stringify(menu));
            populateMenuTable(menuTable, menu);
        });
    }

    // Populate user table in admin dashboard
    if (adminUserTable) {
        adminUserTable.innerHTML = '';
        for (const username in userData.users) {
            const user = userData.users[username];
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${username}</td>
                <td>${user.name}</td>
                <td>${user.address}</td>
                <td>${user.email}</td>
            `;
            adminUserTable.appendChild(row);
        }
    }
});
