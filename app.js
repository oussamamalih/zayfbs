// PRODUCTS DATA
const products = [
  {
    name: "Protein Powder",
    price: 200,
    image: "images/step1.png"
  },
  {
    name: "Fitness Gloves",
    price: 80,
    image: "images/step1.png"
  },
  {
    name: "Fitness Gloves",
    price: 80,
    image: "images/step1.png"
  },
  {
    name: "Fitness Gloves",
    price: 80,
    image: "images/step1.png"
  }
];

// CART ARRAY
let cart = [];

// GET ELEMENTS
const container = document.getElementById("shop-container");
const navLinks = document.querySelectorAll(".nav-links a");
const cartBtn = document.getElementById("cartBtn");
const cartPanel = document.getElementById("cartPanel");
const cartOverlay = document.getElementById("cartOverlay");
const closeCartBtn = document.getElementById("closeCart");
const cartItemsContainer = document.getElementById("cartItems");
const cartCountDisplay = document.getElementById("cartCount");
const totalPriceDisplay = document.getElementById("totalPrice");

// ========== PAGE SWITCHING ==========
function showPage(pageName) {
  container.innerHTML = "";
  navLinks.forEach(link => link.classList.remove("active"));
  document.querySelector(`[data-page="${pageName}"]`).classList.add("active");

  if (pageName === "home") {
    showHome();
  } else if (pageName === "products") {
    showProducts();
  } else if (pageName === "contact") {
    showContact();
  }
}

// ========== HOME PAGE ==========
function showHome() {
  container.innerHTML = `
    <div class="home-section">
      <h1>Welcome to ZayFBS</h1>
      <p>Discover our premium products</p>
      <button class="home-btn" onclick="switchPage('products')">Shop Now</button>
    </div>
  `;
}

// ========== PRODUCTS PAGE ==========
function showProducts() {
  container.innerHTML = '<div class="products-grid"></div>';
  const grid = document.querySelector(".products-grid");

  products.forEach((product, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p class="prix">${product.price} MAD</p>
      <button class="add-btn" onclick="addToCart(${index})">Add to Cart</button>
    `;
    grid.appendChild(card);
  });
}

// ========== CONTACT PAGE ==========
function showContact() {
  container.innerHTML = `
    <div class="contact-section">
      <h1>Nous Contacter</h1>
      <div class="contact-content">
        <div class="contact-info">
          <h3>📍 Adresse</h3>
          <p>Route des Oliviers, Equith Ben Salah</p>
          
          <h3>☎️ Téléphone</h3>
          <p>+212 5 2526 66 44</p>
          
          <h3>✉️ Email</h3>
          <p>contact@zaybs.ma</p>
        </div>
        
        <form class="contact-form" onsubmit="handleSubmit(event)">
          <input type="text" placeholder="Nom complet" required>
          <input type="email" placeholder="Email" required>
          <input type="text" placeholder="Sujet" required>
          <textarea placeholder="Message..." required></textarea>
          <button type="submit">Envoyer</button>
        </form>
      </div>
    </div>
  `;
}

// ========== CART FUNCTIONS ==========
function addToCart(productIndex) {
  const product = products[productIndex];
  cart.push({...product, id: Date.now()});
  updateCart();
  openCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCart();
}

function updateCart() {
  // Update cart count
  cartCountDisplay.textContent = cart.length;

  // Clear cart items container
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<div class="cart-empty">Votre panier est vide</div>';
    totalPriceDisplay.textContent = "0";
    return;
  }

  // Display each item
  cart.forEach((item, index) => {
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");
    cartItem.innerHTML = `
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>${item.price} MAD</p>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${item.id})">Supprimer</button>
    `;
    cartItemsContainer.appendChild(cartItem);
  });

  // Calculate total price
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  totalPriceDisplay.textContent = total;
}

function openCart() {
  cartPanel.classList.add("active");
  cartOverlay.classList.add("active");
}

function closeCart() {
  cartPanel.classList.remove("active");
  cartOverlay.classList.remove("active");
}

// ========== HELPER FUNCTIONS ==========
function switchPage(pageName) {
  showPage(pageName);
}

function handleSubmit(event) {
  event.preventDefault();
  alert("Message sent! We'll contact you soon.");
  event.target.reset();
}

// ========== EVENT LISTENERS ==========
navLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const pageName = link.getAttribute("data-page");
    showPage(pageName);
  });
});

cartBtn.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

// Initialize home page on load
showPage("home");
