document.addEventListener('DOMContentLoaded', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const totalAmount = document.getElementById('total-amount');
    const checkoutButton = document.getElementById('checkout-button');

    function updateCartCount() {
        cartCount.textContent = cart.length;
    }

    function updateCartTotal() {
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        totalAmount.textContent = total.toFixed(2);
    }

    function renderCartItems() {
        cartItemsContainer.innerHTML = '';
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h2>${item.name}</h2>
                    <p>Price: $${item.price}</p>
                    <p>Quantity: ${item.quantity}</p>
                    <button class="btn" data-index="${index}">Remove</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
    }

    function addToCart(item) {
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...item, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCartTotal();
        renderCartItems();
    }

    function removeFromCart(index) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCartTotal();
        renderCartItems();
    }

    cartItemsContainer.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            const index = event.target.dataset.index;
            removeFromCart(index);
        }
    });

    checkoutButton.addEventListener('click', () => {
        window.location.href = 'checkout.html';
    });

    updateCartCount();
    updateCartTotal();
    renderCartItems();
});

// For checkout.html
document.addEventListener('DOMContentLoaded', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const checkoutTableBody = document.querySelector('#checkout-table tbody');

    function renderCheckoutItems() {
        checkoutTableBody.innerHTML = '';
        cart.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>$${item.price}</td>
                <td>${item.quantity}</td>
                <td>$${(item.price * item.quantity).toFixed(2)}</td>
                <td>
                    <button class="btn edit" data-index="${index}">Edit</button>
                    <button class="btn delete" data-index="${index}">Delete</button>
                </td>
            `;
            checkoutTableBody.appendChild(row);
        });
    }

    function editItem(index) {
        const newQuantity = prompt('Enter new quantity:', cart[index].quantity);
        if (newQuantity !== null) {
            cart[index].quantity = parseInt(newQuantity, 10);
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCheckoutItems();
        }
    }

    function deleteItem(index) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCheckoutItems();
    }

    checkoutTableBody.addEventListener('click', (event) => {
        const index = event.target.dataset.index;
        if (event.target.classList.contains('edit')) {
            editItem(index);
        } else if (event.target.classList.contains('delete')) {
            deleteItem(index);
        }
    });

    renderCheckoutItems();
});