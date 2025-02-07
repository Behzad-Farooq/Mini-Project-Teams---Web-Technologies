// Cart state management
let cart = [];

// Load cart from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
    const cartLinks = document.querySelectorAll('.nav-links a[href="cart.html"]');
    cartLinks.forEach(link => {
        if (!link.textContent.includes('(')) {
            const count = cart.reduce((total, item) => total + item.quantity, 0);
            link.innerHTML = `Cart (${count})`;
        }
    });
});

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Update cart count in navigation
// function updateCartCount() {
//     const cartCount = document.getElementById('cart-count');
//     if (cartCount) {
//         cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
//     }
// }

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const cartLinks = document.querySelectorAll('.nav-links a[href="cart.html"]');
    
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Update all cart count elements
    cartLinks.forEach(link => {
        // If there's an existing span, update it, otherwise create a new one
        let countSpan = link.querySelector('span');
        if (!countSpan) {
            countSpan = document.createElement('span');
            link.innerHTML = `Cart (${count})`;
        } else {
            countSpan.textContent = count;
        }
    });
}

// Add item to cart
function addToCart(id, name, price, image, description) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id,
            name,
            price,
            image,
            description,
            quantity: 1
        });
    }
    
    saveCart();
    showNotification('Item added to cart');
}

// Remove item from cart
function removeFromCart(id) {
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex > -1) {
        cart.splice(itemIndex, 1);
        saveCart();
        renderCart();
        showNotification('Item removed from cart');
    }
}

// Show product details
function showDetails(id) {
    const item = cart.find(item => item.id === id);
    if (!item) return;

    const main = document.querySelector('main');
    main.innerHTML = `
        <div class="product-details-container">
            <h1>Product Details</h1>
            <div class="product-details-card">
                <img src="${item.image}" alt="${item.name}">
                <div class="details-info">
                    <h2>${item.name}</h2>
                    <p>Price: ₹${item.price}</p>
                    <p>Quantity: ${item.quantity}</p>
                    <p>Total Cost: ₹${item.price * item.quantity}</p>
                    <button onclick="window.location.href='cart.html'" class="btn">Back to Cart</button>
                </div>
            </div>
        </div>
    `;
}

// Show edit quantity modal
// function showEditModal(id) {
//     const item = cart.find(item => item.id === id);
//     if (!item) return;

//     // Create modal overlay
//     const modal = document.createElement('div');
//     modal.className = 'edit-modal-overlay';
//     modal.innerHTML = `
//         <div class="edit-modal">
//             <h2>Edit Product Item</h2>
//             <div class="modal-content">
//                 <img src="${item.image}" alt="${item.name}" class="modal-image">
//                 <div class="modal-details">
//                     <p>Name: ${item.name}</p>
//                     <p>Price: ₹${item.price}</p>
//                     <div class="quantity-control">
//                         <label for="quantity">Quantity:</label>
//                         <input type="number" id="quantity" value="${item.quantity}" min="1">
//                     </div>
//                     <div class="modal-buttons">
//                         <button onclick="updateItemQuantity('${id}')" class="btn update-btn">Update</button>
//                         <button onclick="closeEditModal()" class="btn back-btn">Back</button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     `;
//     document.body.appendChild(modal);
// }

function showEditModal(id) {
    const item = cart.find(item => item.id === id);
    if (!item) return;

    // Remove any existing modal first
    const existingModal = document.querySelector('.edit-modal-overlay');
    if (existingModal) {
        existingModal.remove();
    }

    // Create and append the modal HTML
    const modal = document.createElement('div');
    modal.className = 'edit-modal-overlay';
    modal.innerHTML = `
        <div class="edit-modal">
            <h2>Edit Product Item</h2>
            <div class="modal-content">
                <img src="${item.image}" alt="${item.name}" class="modal-image">
                <div class="modal-details">
                    <p><strong>Name:</strong> ${item.name}</p>
                    <p><strong>Description:</strong> ${item.description || ''}</p>
                    <p><strong>Price:</strong> ₹${item.price}</p>
                    <div class="quantity-control">
                        <label for="quantity">Quantity:</label>
                        <select id="quantity" class="quantity-select">
                            ${[1, 2, 3, 4, 5].map(num => 
                                `<option value="${num}" ${item.quantity === num ? 'selected' : ''}>${num}</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div class="modal-buttons">
                        <button onclick="updateItemQuantity('${id}')" class="btn update-btn">Update</button>
                        <button onclick="closeEditModal()" class="btn back-btn">Back</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Append modal to body
    document.body.appendChild(modal);

    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
}


// Close edit modal
function closeEditModal() {
    const modal = document.querySelector('.edit-modal-overlay');
    if (modal) {
        modal.remove();
        // document.body.style.overflow = 'auto';
    }
}

// Update item quantity from modal
function updateItemQuantity(id) {
    const quantityInput = document.querySelector('#quantity');
    const newQuantity = parseInt(quantityInput.value);
    
    if (newQuantity > 0) {
        const item = cart.find(item => item.id === id);
        if (item) {
            item.quantity = newQuantity;
            saveCart();
            renderCart();
            closeEditModal();
            showNotification('Quantity updated successfully');
        }
    } else {
        showNotification('Please enter a valid quantity');
    }
}

// Render cart items
function renderCart() {
    const cartItems = document.getElementById('cart-items');
    const totalAmount = document.getElementById('total-amount');
    
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart-message">There are no items in your Cart</p>';
        if (totalAmount) totalAmount.textContent = '0.00';
        return;
    }
    
    cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h2>${item.name}</h2>
                <p>Price: ₹${item.price}</p>
                <p>Quantity: ${item.quantity}</p>
                <p>Total: ₹${item.price * item.quantity}</p>
                <div class="cart-item-actions">
                    <a href="#" onclick="showEditModal('${item.id}'); return false;">Edit</a> |
                    <a href="#" onclick="showDetails('${item.id}'); return false;">Details</a> |
                    <a href="#" onclick="removeFromCart('${item.id}'); return false;">X</a>
                </div>
            </div>
        </div>
    `).join('');
    
    if (totalAmount) {
        totalAmount.textContent = calculateTotal().toFixed(2);
    }
}

// Calculate cart total
function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Handle checkout
function handleCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty');
        return;
    }
    
    const orderNumber = 'OD' + Math.random().toString().slice(2, 11);
    
    cart = [];
    saveCart();
    
    const main = document.querySelector('main');
    main.innerHTML = `
        <div class="order-success">
            <h1>Your Order has been placed successfully</h1>
            <p>Your order number is ${orderNumber}</p>
            <p class="thank-you">Thank you</p>
            <button onclick="window.location.href='shop.html'" class="btn">Continue Shopping</button>
        </div>
    `;
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Add to cart button listeners
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            const name = card.querySelector('h2').textContent;
            const price = parseFloat(card.querySelector('h4').textContent.replace('Price: ', '').replace(',', ''));
            const image = card.querySelector('img').src;
            const description = Array.from(card.querySelectorAll('p'))
                .map(p => p.textContent)
                .join('\n');
            const id = name.toLowerCase().replace(/\s+/g, '-');
            
            addToCart(id, name, price, image, description);
        });
    });
    
    // Checkout button listener
    const checkoutButton = document.getElementById('checkout-button');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', handleCheckout);
    }
    
    // Render cart if on cart page
    if (document.getElementById('cart-items')) {
        renderCart();
    }
});