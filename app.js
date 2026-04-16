// ============================================================
//  script.js – ZayFBS Website
// ============================================================


// ===================================================
// 1. NAVIGATION – switch between pages
// ===================================================

function showPage(pageName) {
  // Hide all pages
  const allPages = document.querySelectorAll('.page');
  allPages.forEach(function(page) {
    page.classList.remove('active');
  });

  // Show the page we want
  document.getElementById('page-' + pageName).classList.add('active');

  // Highlight the active nav link
  const allLinks = document.querySelectorAll('.nav-links a');
  allLinks.forEach(function(link) {
    link.classList.remove('active');
  });
  document.getElementById('nav-' + pageName).classList.add('active');

  // Scroll to top
  window.scrollTo(0, 0);
}


// ===================================================
// 2. PRODUCTS DATA
// ===================================================

// This array holds all products
var products = [
  {
    id: 1,
    name: "Huile Extra Vierge Classique",
    desc: "Pressée à froid, issue d'olives Picholine marocaine. Arôme fruité, légèrement poivré, idéale en cuisine.",
    price: 75,
    img: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80"
  },
  {
    id: 2,
    name: "Huile Bio Premium 500ml",
    desc: "Certifiée Agriculture Biologique. Zéro pesticide, récolte manuelle. Goût intense et délicat.",
    price: 120,
    img: "https://images.unsplash.com/photo-1588975600290-8cfc9fd7855c?w=400&q=80"
  },
  {
    id: 3,
    name: "Huile Artisanale 1L",
    desc: "Extraction traditionnelle à la meule de pierre. Richesse en polyphénols. Conditionnée en bouteille verre.",
    price: 145,
    img: "https://images.unsplash.com/photo-1601459427108-47e20d579a05?w=400&q=80"
  },
  {
    id: 4,
    name: "Coffret Découverte",
    desc: "3 bouteilles de 250ml représentant nos 3 variétés d'olives locales. Idéal cadeau ou dégustation.",
    price: 210,
    img: "https://images.unsplash.com/photo-1628157588553-5eeea00af15c?w=400&q=80"
  }
];

// This keeps track of which product we are editing (null = adding new)
var editingId = null;


// Render all product cards to the page
function renderProducts() {
  var grid = document.getElementById('products-grid');
  grid.innerHTML = ''; // clear first

  products.forEach(function(product) {
    var card = document.createElement('div');
    card.className = 'card';
    card.innerHTML =
      '<img src="' + product.img + '" alt="' + product.name + '" onerror="this.src=\'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80\'"/>' +
      '<div class="card-body">' +
        '<h3>' + product.name + '</h3>' +
        '<p>' + product.desc + '</p>' +
        '<p class="prod-price">' + product.price + ' DH</p>' +
        '<div class="prod-actions">' +
          '<button class="btn btn-secondary" onclick="addToCart(' + product.id + ')">Ajouter</button>' +
          '<button class="btn btn-outline"    onclick="openModal(' + product.id + ')">Modifier</button>' +
          '<button class="btn btn-danger"     onclick="deleteProduct(' + product.id + ')">Supprimer</button>' +
        '</div>' +
      '</div>';
    grid.appendChild(card);
  });
}


// ===================================================
// 3. MODAL – Add / Edit product
// ===================================================

function openModal(productId) {
  var overlay = document.getElementById('modal-overlay');
  overlay.classList.add('open');

  if (productId) {
    // We are EDITING an existing product
    editingId = productId;
    document.getElementById('modal-title').textContent = 'Modifier le produit';

    // Find the product and fill the form
    var product = products.find(function(p) { return p.id === productId; });
    document.getElementById('prod-name').value  = product.name;
    document.getElementById('prod-desc').value  = product.desc;
    document.getElementById('prod-price').value = product.price;
    document.getElementById('prod-img').value   = product.img;
  } else {
    // We are ADDING a new product
    editingId = null;
    document.getElementById('modal-title').textContent = 'Ajouter un produit';
    document.getElementById('prod-name').value  = '';
    document.getElementById('prod-desc').value  = '';
    document.getElementById('prod-price').value = '';
    document.getElementById('prod-img').value   = '';
  }
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
}

function saveProduct() {
  // Get values from the form
  var name  = document.getElementById('prod-name').value.trim();
  var desc  = document.getElementById('prod-desc').value.trim();
  var price = parseInt(document.getElementById('prod-price').value);
  var img   = document.getElementById('prod-img').value.trim();

  // Basic validation
  if (!name || !desc || !price) {
    alert('Veuillez remplir les champs obligatoires (*)');
    return;
  }

  // Default image if none provided
  if (!img) {
    img = 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80';
  }

  if (editingId) {
    // Update existing product
    var index = products.findIndex(function(p) { return p.id === editingId; });
    products[index].name  = name;
    products[index].desc  = desc;
    products[index].price = price;
    products[index].img   = img;
  } else {
    // Add new product
    var newId = Date.now(); // unique id using timestamp
    products.push({ id: newId, name: name, desc: desc, price: price, img: img });
  }

  closeModal();
  renderProducts();
}


// ===================================================
// 4. DELETE product
// ===================================================

function deleteProduct(productId) {
  var confirmed = confirm('Voulez-vous vraiment supprimer ce produit ?');
  if (confirmed) {
    // Remove it from the array
    products = products.filter(function(p) { return p.id !== productId; });
    renderProducts();
  }
}


// ===================================================
// 5. SHOPPING CART
// ===================================================

// Cart is an array of objects: { id, name, price, qty }
var cart = [];


// Open or close the cart sidebar
function toggleCart() {
  var sidebar = document.getElementById('cart-sidebar');
  var overlay = document.getElementById('cart-overlay');
  sidebar.classList.toggle('open');
  overlay.classList.toggle('open');
}


// Add a product to the cart
function addToCart(productId) {
  var product = products.find(function(p) { return p.id === productId; });

  // Check if the product is already in the cart
  var existing = cart.find(function(item) { return item.id === productId; });

  if (existing) {
    // Just increase the quantity
    existing.qty += 1;
  } else {
    // Add new item to cart
    cart.push({
      id:    product.id,
      name:  product.name,
      price: product.price,
      qty:   1
    });
  }

  updateCartUI();

  // Give a small visual feedback
  alert('✅ "' + product.name + '" ajouté au panier !');
}


// Increase quantity of an item
function increaseQty(productId) {
  var item = cart.find(function(i) { return i.id === productId; });
  if (item) item.qty += 1;
  updateCartUI();
}


// Decrease quantity – remove item if qty reaches 0
function decreaseQty(productId) {
  var item = cart.find(function(i) { return i.id === productId; });
  if (item) {
    item.qty -= 1;
    if (item.qty <= 0) {
      // Remove from cart
      cart = cart.filter(function(i) { return i.id !== productId; });
    }
  }
  updateCartUI();
}


// Re-draw the cart sidebar contents
function updateCartUI() {
  var cartItemsDiv = document.getElementById('cart-items');
  var cartCountEl  = document.getElementById('cart-count');
  var cartTotalEl  = document.getElementById('cart-total');

  // Count total items
  var totalItems = cart.reduce(function(sum, item) { return sum + item.qty; }, 0);
  cartCountEl.textContent = totalItems;

  // Calculate total price
  var totalPrice = cart.reduce(function(sum, item) { return sum + item.price * item.qty; }, 0);
  cartTotalEl.textContent = totalPrice + ' DH';

  // Empty cart message
  if (cart.length === 0) {
    cartItemsDiv.innerHTML = '<p class="cart-empty">Votre panier est vide.</p>';
    return;
  }

  // Build HTML for each cart item
  var html = '';
  cart.forEach(function(item) {
    html +=
      '<div class="cart-item">' +
        '<div class="cart-item-info">' +
          '<strong>' + item.name + '</strong>' +
          '<span>' + item.price + ' DH</span>' +
        '</div>' +
        '<div class="cart-qty">' +
          '<button onclick="decreaseQty(' + item.id + ')">−</button>' +
          '<span>' + item.qty + '</span>' +
          '<button onclick="increaseQty(' + item.id + ')">+</button>' +
        '</div>' +
      '</div>';
  });

  cartItemsDiv.innerHTML = html;
}


// ===================================================
// 6. INIT – run when page loads
// ===================================================

// Render products when the site first loads
renderProducts();

// Show the home page by default
showPage('home');
