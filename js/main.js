class MenuItem {
    constructor(id, name, category, price, image, description) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.price = price;
        this.image = image;
        this.description = description;
    }
}

let menuData = [];

let cart = [];
let currentCategory = "all";
let searchTerm = "";
let appInitialized = false;

async function loadMenu() {
    try {
        const response = await fetch('/api/menu');
        const data = await response.json();
        menuData = data.map(item => new MenuItem(item.id, item.name, item.category, item.price, item.image, item.description));
        renderMenuGrid();
    } catch (error) {
        console.error('Error loading menu:', error);
    }
}

let menuQuantities = {}; // Object to store quantities for each item

function initApp() {
    if (appInitialized) return;
    appInitialized = true;
    loadMenu();
    updateCartCount();

    // Delegate clicks (works even for dynamically inserted elements)
    document.addEventListener("click", e => {
        if (e.target && e.target.classList && e.target.classList.contains("filter-btn")) {
            document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");
            currentCategory = e.target.dataset.category;
            renderMenuGrid();
        }

        if (e.target && e.target.classList && e.target.classList.contains("cart-btn")) {
            const id = parseInt(e.target.dataset.id);
            addToCart(id, menuQuantities[id] || 1);
            menuQuantities[id] = 0; // Reset after adding
            renderMenuGrid(); // Re-render to update quantities
        }
    });

    // Attach element-specific handlers if elements exist (components may be loaded async)
    document.getElementById("cartIcon")?.addEventListener("click", renderCart);
    document.getElementById("backToCart")?.addEventListener("click", hideCheckout);
    document.getElementById("checkoutForm")?.addEventListener("submit", placeOrder);

    // Search functionality
    document.getElementById("searchInput")?.addEventListener("input", (e) => {
        searchTerm = e.target.value.trim();
        renderMenuGrid();
        renderSearchResults();
    });

    // Clear search when modal is closed
    document.getElementById("searchModal")?.addEventListener("hidden.bs.modal", () => {
        searchTerm = "";
        document.getElementById("searchInput").value = "";
        renderMenuGrid();
        renderSearchResults();
    });
}

// Initialize when DOM is ready or after components are fetched/inserted
window.addEventListener("componentsLoaded", initApp);

function changeQuantity(id, delta) {
    if (!menuQuantities[id]) menuQuantities[id] = 0;
    menuQuantities[id] = Math.max(0, menuQuantities[id] + delta);
    renderMenuGrid();
    renderSearchResults();
}

function renderMenuGrid() {
    const grid = document.getElementById("menuGrid");
    let items = currentCategory === "all" ? menuData : menuData.filter(i => i.category === currentCategory);

    // Apply search filter
    if (searchTerm)
        items = items.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!grid) return;

    grid.innerHTML = items.map(item => `
        <div class="col-md-4">
            <div class="menu-card">
                <div class="img-box">
                    <img src="${item.image}" alt="${item.name}">    
                </div>
                <div class="content-box">
                    <h5>${item.name}</h5>
                    <p>${item.description}</p>
                    <div class="price-row d-flex justify-content-between align-items-center">
                        <span>Rs${item.price}</span>
                        <div class="quantity-controls d-flex align-items-center">
                            <button class="btn btn-sm btn-outline-secondary me-1" onclick="changeQuantity(${item.id}, -1)">-</button>
                            <span class="mx-2">${menuQuantities[item.id] || 0}</span>
                            <button class="btn btn-sm btn-outline-secondary me-2" onclick="changeQuantity(${item.id}, 1)">+</button>
                            <button type="button" class="btn btn-sm btn-primary cart-btn" data-id="${item.id}">Add to cart</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join("");
}

function renderSearchResults() {
    const resultsEl = document.getElementById("searchResults");
    if (!resultsEl) return;

    if (!searchTerm) {
        resultsEl.innerHTML = '<p class="text-muted">Start typing to search for menu items...</p>';
        return;
    }

    const filteredItems = menuData.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filteredItems.length === 0) {
        resultsEl.innerHTML = '<p class="text-muted">No items found matching your search.</p>';
        return;
    }

    resultsEl.innerHTML = filteredItems.map(item => `
        <div class="col-md-6">
            <div class="menu-card">
                <div class="img-box">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="content-box">
                    <h6>${item.name}</h6>
                    <p class="small">${item.description}</p>
                    <div class="price-row d-flex justify-content-between align-items-center">
                        <span>Rs${item.price}</span>
                        <div class="quantity-controls d-flex align-items-center">
                            <button class="btn btn-sm btn-outline-secondary me-1" onclick="changeQuantity(${item.id}, -1)">-</button>
                            <span class="mx-2">${menuQuantities[item.id] || 0}</span>
                            <button class="btn btn-sm btn-outline-secondary me-2" onclick="changeQuantity(${item.id}, 1)">+</button>
                            <button type="button" class="btn btn-sm btn-primary cart-btn" data-id="${item.id}">Add to cart</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join("");
}

function addToCart(id, qty = 1) {
    if (qty <= 0) return;
    const item = menuData.find(i => i.id === id);
    const existing = cart.find(i => i.id === id);
    if (existing) existing.quantity += qty;
    else cart.push({ ...item, quantity: qty });
    updateCartCount();
    showToast(`${item.name} (${qty}) added to cart`, "success");
}

function updateCartCount() {
    const el = document.getElementById("cartCount");
    if (el) el.textContent = cart.reduce((s, i) => s + i.quantity, 0);
}

function renderCart() {
    const items = document.getElementById("cartItems");
    const totalEl = document.getElementById("cartTotal");
    const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

    if (items) {
        items.innerHTML = cart.length === 0
            ? `<p class="text-center">Cart is empty</p>`
            : cart.map(i => `
        <div class="cart-item d-flex justify-content-between">
            <span>${i.name} x ${i.quantity}</span>
            <strong>Rs${(i.price * i.quantity).toFixed(0)}</strong>
        </div>
    `).join("");
    }

    if (totalEl) totalEl.textContent = total.toFixed(0);
}

function showCheckout() {
    if (cart.length === 0) { showToast("Cart is empty!", "warning"); return; }
    const cartModalEl = document.getElementById("cartModal");
    if (cartModalEl) {
        const cartModal = bootstrap.Modal.getInstance(cartModalEl);
        if (cartModal) cartModal.hide();
    }
    setTimeout(() => {
        renderCheckout();
        const overlay = document.getElementById("checkoutOverlay");
        if (overlay) {
            overlay.classList.remove("d-none");
            document.body.style.overflow = "hidden";
        }
    }, 300);
}

function hideCheckout() {
    document.getElementById("checkoutOverlay").classList.add("d-none");
    document.body.style.overflow = "auto";
}

function renderCheckout() {
    const items = document.getElementById("checkoutOrderItems");
    const totalEl = document.getElementById("checkoutTotal");
    const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

    if (items) items.innerHTML = cart.map(i => `
        <div class="order-item d-flex justify-content-between">
            <span>${i.name} x ${i.quantity}</span>
            <strong>Rs${(i.price * i.quantity).toFixed(0)}</strong>
        </div>
    `).join("");

    if (totalEl) totalEl.textContent = total.toFixed(0);
}

function placeOrder(e){
    e.preventDefault();
    const form = document.getElementById('checkoutForm');
    const formData = new FormData(form);
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orderData = {
        customer_name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        items: cart,
        total: total
    };
    fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
    })
    .then(res => res.json())
    .then(data => {
        showToast("Order placed successfully!", "success");
        cart = [];
        updateCartCount();
        hideCheckout();
    })
    .catch(err => {
        console.error('Error placing order:', err);
        showToast("Error placing order!", "danger");
    });
}

function showToast(msg,type="primary"){
    const t=document.createElement("div");
    t.className=`toast bg-${type} text-white position-fixed`;
    t.style.cssText="top:20px;right:20px;z-index:9999";
    t.innerHTML=`<div class="toast-body">${msg}</div>`;
    document.body.appendChild(t);
    new bootstrap.Toast(t).show();
    t.addEventListener("hidden.bs.toast",()=>t.remove());
}
