/* ================================================================
   ZayFBS – script.js
   Gestion : Produits (CRUD), Panier, Contact
   ================================================================ */

'use strict';

// ── Produits par défaut ──────────────────────────────────────────
const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: 'Huile Extra Vierge Classique',
    price: 75,
    description: "Pressée à froid, issue d'olives Picholine marocaine. Arôme fruité, légèrement poivré, idéale en cuisine.",
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80'
  },
  {
    id: 2,
    name: 'Huile Bio Premium 500ml',
    price: 120,
    description: 'Certifiée Agriculture Biologique. Zéro pesticide, récolte manuelle. Goût intense et délicat.',
    image: 'https://images.unsplash.com/photo-1601039641847-7857b994d704?w=400&q=80'
  },
  {
    id: 3,
    name: 'Huile Artisanale 1L',
    price: 145,
    description: 'Extraction traditionnelle à la meule de pierre. Richesse en polyphénols. Conditionnée en bouteille verre.',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80'
  },
  {
    id: 4,
    name: 'Coffret Découverte',
    price: 210,
    description: '3 bouteilles de 250ml représentant nos 3 variétés d\'olives locales. Idéal cadeau ou dégustation.',
    image: 'https://images.unsplash.com/photo-1582515073490-39981397c445?w=400&q=80'
  }
];

// ── État global ──────────────────────────────────────────────────
let products = JSON.parse(localStorage.getItem('zayfbs_products')) || DEFAULT_PRODUCTS;
let cart     = JSON.parse(localStorage.getItem('zayfbs_cart'))     || [];
let editingId = null;

// ── Persistance ──────────────────────────────────────────────────
const saveProducts = () => localStorage.setItem('zayfbs_products', JSON.stringify(products));
const saveCart     = () => localStorage.setItem('zayfbs_cart',     JSON.stringify(cart));

/* ================================================================
   INITIALISATION
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ----- Page Produits ----- */
  if (document.getElementById('productGrid')) {
    renderProducts();
    injectProductModal();
    document.getElementById('addProductBtn').addEventListener('click', openAddModal);
  }

  /* ----- Panier (toutes pages) ----- */
  initCart();

  /* ----- Contact ----- */
  injectContactModal();

  /* ----- Bouton "Découvrir nos produits" (Accueil) ----- */
  const discoverBtn = document.querySelector('.btn-discover');
  if (discoverBtn) {
    discoverBtn.addEventListener('click', () => {
      window.location.href = 'produit.html';
    });
  }

  /* ----- Navbar : lien Contact ----- */
  document.querySelectorAll('[data-page="contact"]').forEach(link => {
    link.addEventListener('click', e => { e.preventDefault(); openContact(); });
  });
});


/* ================================================================
   PRODUITS — CRUD
   ================================================================ */

function renderProducts() {
  const grid = document.getElementById('productGrid');
  if (!grid) return;

  grid.innerHTML = '';

  if (products.length === 0) {
    grid.innerHTML = `
      <div class="empty-products">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#408A71" stroke-width="1.2">
          <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/>
          <path d="M16 3H8a2 2 0 00-2 4h12a2 2 0 00-2-4z"/>
        </svg>
        <p>Aucun produit disponible.<br>Cliquez sur <strong>+ Ajouter un produit</strong> pour commencer.</p>
      </div>`;
    return;
  }

  products.forEach(p => grid.insertAdjacentHTML('beforeend', buildCardHTML(p)));
}

function buildCardHTML(p) {
  return `
    <div class="product-card" data-id="${p.id}">
      <div class="card-img-wrap">
        <img src="${p.image}"
             alt="${escapeHTML(p.name)}"
             onerror="this.src='https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80'" />
      </div>
      <div class="card-body">
        <h3>${escapeHTML(p.name)}</h3>
        <p>${escapeHTML(p.description)}</p>
        <span class="price">${p.price} DH</span>
        <div class="card-actions">
          <button class="btn-ajouter" onclick="addToCart(this)">Ajouter</button>
          <button class="btn-modifier" onclick="openEditModal(${p.id})">Modifier</button>
          <button class="btn-supprimer" onclick="deleteProduct(${p.id})">Supprimer</button>
        </div>
      </div>
    </div>`;
}

/* ── CREATE ── */
function addProduct(data) {
  products.push({ id: Date.now(), ...data });
  saveProducts();
  renderProducts();
  showToast('✓ Produit ajouté avec succès !');
}

/* ── UPDATE ── */
function updateProduct(id, data) {
  products = products.map(p => p.id === id ? { id, ...data } : p);
  saveProducts();
  renderProducts();
  showToast('✓ Produit modifié avec succès !');
}

/* ── DELETE ── */
function deleteProduct(id) {
  openConfirm('Supprimer ce produit ?', () => {
    products = products.filter(p => p.id !== id);
    cart     = cart.filter(c => c.id !== id);
    saveProducts();
    saveCart();
    renderProducts();
    renderCart();
    showToast('Produit supprimé.');
  });
}


/* ================================================================
   MODAL PRODUIT (Add / Edit)
   ================================================================ */

function injectProductModal() {
  document.body.insertAdjacentHTML('beforeend', `
    <div class="modal-overlay" id="prodOverlay" onclick="closeProductModal()"></div>

    <div class="modal" id="productModal" role="dialog" aria-modal="true">
      <div class="modal-header">
        <h2 id="modalTitle">Ajouter un produit</h2>
        <button class="modal-close" onclick="closeProductModal()" aria-label="Fermer">✕</button>
      </div>
      <div class="modal-body">
        <div class="img-preview-wrap" id="imgPreviewWrap" style="display:none">
          <img id="imgPreview" src="" alt="Aperçu" />
        </div>
        <div class="form-group">
          <label for="fImage">URL de l'image</label>
          <input type="url" id="fImage" placeholder="https://..." />
        </div>
        <div class="form-group">
          <label for="fName">Titre <span class="req">*</span></label>
          <input type="text" id="fName" placeholder="Nom du produit" required />
        </div>
        <div class="form-group">
          <label for="fDesc">Description <span class="req">*</span></label>
          <textarea id="fDesc" rows="3" placeholder="Description du produit" required></textarea>
        </div>
        <div class="form-group">
          <label for="fPrice">Prix (DH) <span class="req">*</span></label>
          <input type="number" id="fPrice" placeholder="0" min="0" step="0.01" required />
        </div>
        <p class="form-error" id="prodFormError"></p>
        <div class="form-actions">
          <button type="button" class="btn-cancel" onclick="closeProductModal()">Annuler</button>
          <button type="button" class="btn-save" id="btnSave" onclick="handleProductSubmit()">Ajouter</button>
        </div>
      </div>
    </div>

    <!-- Confirmation dialog -->
    <div class="modal-overlay" id="confirmOverlay"></div>
    <div class="modal confirm-modal" id="confirmModal" role="alertdialog">
      <p id="confirmText"></p>
      <div class="form-actions">
        <button class="btn-cancel" onclick="closeConfirm(false)">Annuler</button>
        <button class="btn-delete" onclick="closeConfirm(true)">Supprimer</button>
      </div>
    </div>
  `);

  /* Image URL preview */
  document.getElementById('fImage').addEventListener('input', function () {
    const wrap = document.getElementById('imgPreviewWrap');
    const img  = document.getElementById('imgPreview');
    if (this.value) {
      img.src = this.value;
      wrap.style.display = 'block';
      img.onerror = () => { wrap.style.display = 'none'; };
      img.onload  = () => { wrap.style.display = 'block'; };
    } else {
      wrap.style.display = 'none';
    }
  });
}

function openAddModal() {
  editingId = null;
  document.getElementById('modalTitle').textContent  = 'Ajouter un produit';
  document.getElementById('btnSave').textContent     = 'Ajouter';
  document.getElementById('prodFormError').textContent = '';
  ['fImage','fName','fDesc','fPrice'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('imgPreviewWrap').style.display = 'none';
  toggleModal('prodOverlay', 'productModal', true);
}

function openEditModal(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  editingId = id;
  document.getElementById('modalTitle').textContent  = 'Modifier le produit';
  document.getElementById('btnSave').textContent     = 'Enregistrer';
  document.getElementById('prodFormError').textContent = '';
  document.getElementById('fImage').value = p.image || '';
  document.getElementById('fName').value  = p.name;
  document.getElementById('fDesc').value  = p.description;
  document.getElementById('fPrice').value = p.price;

  const wrap = document.getElementById('imgPreviewWrap');
  const img  = document.getElementById('imgPreview');
  if (p.image) { img.src = p.image; wrap.style.display = 'block'; }
  else { wrap.style.display = 'none'; }

  toggleModal('prodOverlay', 'productModal', true);
}

function closeProductModal() {
  toggleModal('prodOverlay', 'productModal', false);
}

function handleProductSubmit() {
  const name  = document.getElementById('fName').value.trim();
  const desc  = document.getElementById('fDesc').value.trim();
  const price = parseFloat(document.getElementById('fPrice').value);
  const image = document.getElementById('fImage').value.trim();
  const err   = document.getElementById('prodFormError');

  if (!name || !desc || isNaN(price) || price < 0) {
    err.textContent = '⚠ Veuillez remplir tous les champs obligatoires.';
    return;
  }
  err.textContent = '';

  const data = {
    name, description: desc, price,
    image: image || 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80'
  };

  if (editingId) updateProduct(editingId, data);
  else           addProduct(data);

  closeProductModal();
}


/* ================================================================
   CONFIRMATION DIALOG
   ================================================================ */
let _confirmCallback = null;

function openConfirm(text, callback) {
  _confirmCallback = callback;
  document.getElementById('confirmText').textContent = text;
  toggleModal('confirmOverlay', 'confirmModal', true);
}

function closeConfirm(confirmed) {
  toggleModal('confirmOverlay', 'confirmModal', false);
  if (confirmed && typeof _confirmCallback === 'function') _confirmCallback();
  _confirmCallback = null;
}


/* ================================================================
   PANIER
   ================================================================ */

function initCart() {
  const cartBtn      = document.getElementById('cartBtn');
  const closeCartBtn = document.getElementById('closeCartBtn');

  if (cartBtn)      cartBtn.addEventListener('click', openCart);
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);

  /* Checkout */
  const checkoutBtn = document.querySelector('.btn-checkout');
  if (checkoutBtn) checkoutBtn.addEventListener('click', handleCheckout);

  renderCart();
  updateCartBadge();
}

/* ── Ajouter au panier ── */
function addToCart(btn) {
  const card = btn.closest('.product-card');
  if (!card) return;

  const id = parseInt(card.dataset.id);
  const p  = products.find(x => x.id === id);
  if (!p) return;

  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id: p.id, name: p.name, price: p.price, image: p.image, qty: 1 });
  }
  saveCart();
  renderCart();
  updateCartBadge();

  /* Feedback visuel */
  btn.textContent = '✓ Ajouté';
  btn.classList.add('added');
  setTimeout(() => { btn.textContent = 'Ajouter'; btn.classList.remove('added'); }, 1600);

  showToast(`🛒 ${p.name} ajouté au panier`);
  bounceCartBtn();
}

/* ── Changer quantité ── */
function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(c => c.id !== id);
  saveCart();
  renderCart();
  updateCartBadge();
}

/* ── Supprimer du panier ── */
function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  saveCart();
  renderCart();
  updateCartBadge();
}

/* ── Vider le panier ── */
function clearCart() {
  cart = [];
  saveCart();
  renderCart();
  updateCartBadge();
}

/* ── Rendu du panier ── */
function renderCart() {
  const list    = document.getElementById('cartList');
  const empty   = document.getElementById('cartEmpty');
  const footer  = document.getElementById('cartFooter');
  const totalEl = document.getElementById('cartTotal');
  if (!list) return;

  list.innerHTML = '';

  if (cart.length === 0) {
    if (empty)  empty.style.display  = 'flex';
    if (footer) footer.style.display = 'none';
    return;
  }

  if (empty)  empty.style.display  = 'none';
  if (footer) footer.style.display = 'block';

  cart.forEach(item => {
    list.insertAdjacentHTML('beforeend', `
      <li class="cart-item" data-id="${item.id}">
        <div class="cart-item-img">
          <img src="${item.image}"
               alt="${escapeHTML(item.name)}"
               onerror="this.src='https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=50&q=60'" />
        </div>
        <div class="cart-item-info">
          <h4>${escapeHTML(item.name)}</h4>
          <span class="cart-item-price">${(item.price * item.qty).toFixed(2)} DH</span>
        </div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)" aria-label="Diminuer">−</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id},  1)" aria-label="Augmenter">+</button>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${item.id})" aria-label="Retirer">✕</button>
      </li>`);
  });

  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  if (totalEl) totalEl.textContent = `${total.toFixed(2)} DH`;
}

/* ── Badge compteur ── */
function updateCartBadge() {
  const count   = cart.reduce((s, c) => s + c.qty, 0);
  const cartBtn = document.getElementById('cartBtn');
  if (!cartBtn) return;

  let badge = document.getElementById('cartBadge');
  if (!badge) {
    badge = document.createElement('span');
    badge.id        = 'cartBadge';
    badge.className = 'cart-badge';
    cartBtn.appendChild(badge);
  }
  badge.textContent    = count > 99 ? '99+' : count;
  badge.style.display  = count > 0 ? 'flex' : 'none';
}

function openCart()  {
  document.getElementById('cartPanel')?.classList.add('open');
  document.getElementById('overlay')?.classList.add('active');
}
function closeCart() {
  document.getElementById('cartPanel')?.classList.remove('open');
  document.getElementById('overlay')?.classList.remove('active');
}

/* ── Commander ── */
function handleCheckout() {
  if (cart.length === 0) return;
  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  showToast(`✓ Commande de ${total.toFixed(2)} DH confirmée ! Merci.`);
  clearCart();
  closeCart();
}

function bounceCartBtn() {
  const btn = document.getElementById('cartBtn');
  if (!btn) return;
  btn.classList.add('bounce');
  setTimeout(() => btn.classList.remove('bounce'), 450);
}


/* ================================================================
   FORMULAIRE DE CONTACT
   ================================================================ */

function injectContactModal() {
  document.body.insertAdjacentHTML('beforeend', `
    <div class="modal-overlay" id="contactOverlay" onclick="closeContact()"></div>

    <div class="modal" id="contactModal" role="dialog" aria-modal="true">
      <div class="modal-header">
        <h2>Nous Contacter</h2>
        <button class="modal-close" onclick="closeContact()" aria-label="Fermer">✕</button>
      </div>
      <div class="modal-body">
        <p class="contact-intro">
          Une question sur nos produits ? Écrivez-nous, nous répondons sous 24 h.
        </p>
        <div class="form-group">
          <label for="cName">Nom complet <span class="req">*</span></label>
          <input type="text"  id="cName"    placeholder="Votre nom" />
        </div>
        <div class="form-group">
          <label for="cEmail">Email <span class="req">*</span></label>
          <input type="email" id="cEmail"   placeholder="votre@email.com" />
        </div>
        <div class="form-group">
          <label for="cPhone">Téléphone</label>
          <input type="tel"   id="cPhone"   placeholder="+212 6XX XXX XXX" />
        </div>
        <div class="form-group">
          <label for="cMessage">Message <span class="req">*</span></label>
          <textarea id="cMessage" rows="4" placeholder="Votre message…"></textarea>
        </div>
        <p class="form-error" id="contactError"></p>
        <div class="form-actions">
          <button type="button" class="btn-cancel" onclick="closeContact()">Annuler</button>
          <button type="button" class="btn-save"   onclick="handleContact()">Envoyer</button>
        </div>
      </div>
    </div>
  `);
}

function openContact() {
  ['cName','cEmail','cPhone','cMessage'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.getElementById('contactError').textContent = '';
  toggleModal('contactOverlay', 'contactModal', true);
}

function closeContact() {
  toggleModal('contactOverlay', 'contactModal', false);
}

function handleContact() {
  const name    = document.getElementById('cName').value.trim();
  const email   = document.getElementById('cEmail').value.trim();
  const message = document.getElementById('cMessage').value.trim();
  const err     = document.getElementById('contactError');

  if (!name || !email || !message) {
    err.textContent = '⚠ Veuillez remplir tous les champs obligatoires.';
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    err.textContent = '⚠ Adresse email invalide.';
    return;
  }

  err.textContent = '';
  closeContact();
  showToast(`✉ Merci ${name} ! Votre message a bien été envoyé.`);
}


/* ================================================================
   UTILITAIRES
   ================================================================ */

/* Afficher / masquer un modal */
function toggleModal(overlayId, modalId, open) {
  document.getElementById(overlayId)?.classList.toggle('active', open);
  document.getElementById(modalId)?.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
}

/* Notification toast */
let _toastTimer;
function showToast(msg) {
  let toast = document.getElementById('zToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id        = 'zToast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  clearTimeout(_toastTimer);
  toast.textContent = msg;
  toast.classList.add('show');
  _toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

/* Échapper le HTML pour éviter les XSS */
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}