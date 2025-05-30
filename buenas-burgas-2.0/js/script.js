/* =========================================================
   DATOS (en “proyecto real” podrían venir de un backend)
========================================================= */
const products = [
  { id: 1,  nombre: 'Doble cuarto de libra con queso', precio: 8.99, imagen: 'img/doblecuartodelibraconqueso.jpg' },
  { id: 2,  nombre: 'Chicken Burger',                 precio: 7.99, imagen: 'img/mcpollo.jpg' },
  { id: 3,  nombre: 'Crispy BBQ',                     precio: 9.49, imagen: 'img/mccrispybbq.jpg' },
  { id: 4,  nombre: 'Classic Burger',                 precio: 6.99, imagen: 'img/bigmac.jpg' },
  { id: 5,  nombre: 'Cheeseburger',                   precio: 5.49, imagen: 'img/mcnifica.jpg' },
  { id: 6,  nombre: 'Nuggets',                        precio: 4.99, imagen: 'img/nuggets.jpg' },
  { id: 7,  nombre: 'Jugo de manzana',                precio: 2.49, imagen: 'img/jugomanzana.jpg' },
  { id: 8,  nombre: 'Agua',                           precio: 1.99, imagen: 'img/agua.jpg' },
  { id: 9,  nombre: 'Flurry Delight',                 precio: 3.99, imagen: 'img/mcflurry.jpg' },
  { id: 10, nombre: 'ChocoDelight Sundae',            precio: 2.99, imagen: 'img/sundaechocolate.jpg' }
];

/* =========================================================
   UTILIDADES DE CARRITO
========================================================= */
const CART_KEY = 'bb_cart';

const getCart  = ()           => JSON.parse(localStorage.getItem(CART_KEY)) || [];
const saveCart = cart         => localStorage.setItem(CART_KEY, JSON.stringify(cart));

function addToCart(id) {
  const cart = getCart();
  const item = cart.find(p => p.id === id);
  item ? item.qty++ : cart.push({ id, qty: 1 });
  saveCart(cart);
  updateCartBadge();
}

function changeQty(id, delta) {
  const cart = getCart();
  const item = cart.find(p => p.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) return removeItem(id);
  saveCart(cart);
  renderCartPage();
  updateCartBadge();
}

function removeItem(id) {
  const cart = getCart().filter(p => p.id !== id);
  saveCart(cart);
  renderCartPage();
  updateCartBadge();
}

function clearCart() {
  saveCart([]);
  renderCartPage();
  updateCartBadge();
}

const cartTotal = () =>
  getCart()
    .reduce((acc, p) => acc + p.qty * products.find(prod => prod.id === p.id).precio, 0)
    .toFixed(2);

/* =========================================================
   RENDER – MENÚ (menu.html)
========================================================= */
function renderMenu() {
  const cont = document.getElementById('cartadeproductos');
  if (!cont) return;               // No estamos en menu.html

  cont.innerHTML = products.map(p => `
    <div class="col-6 col-md-4 col-lg-3">
      <div class="card product-card h-100 shadow-sm">
        <img src="${p.imagen}" class="card-img-top" alt="${p.nombre}">
        <div class="card-body d-flex flex-column">
          <h2 class="h6">${p.nombre}</h2>
          <p class="mb-2 fw-bold">$${p.precio}</p>
          <button class="btn btn-main w-100 mt-auto btn-comprar" data-id="${p.id}">Agregar</button>
        </div>
      </div>
    </div>
  `).join('');

  cont.querySelectorAll('.btn-comprar').forEach(btn =>
    btn.addEventListener('click', () => addToCart(Number(btn.dataset.id)))
  );
}

/* =========================================================
   PÁGINA CARRITO (carrito.html) – diseño con cards
========================================================= */
function renderCartPage() {
  const cont       = document.getElementById('cart-list');      // div.row g-4
  const totalEl    = document.getElementById('cart-page-total');
  if (!cont) return;                                            // No estamos en carrito.html

  const cart = getCart();

  // Carrito vacío
  if (cart.length === 0) {
    cont.innerHTML =
      `<div class="col-12 text-center">
          <p class="lead">Tu carrito está vacío 😢</p>
          <a href="menu.html" class="btn btn-main mt-2">Ir al Menú</a>
       </div>`;
    totalEl.textContent = '$0.00';
    return;
  }

  // Render de productos como cards
  cont.innerHTML = cart.map(p => {
    const prod = products.find(item => item.id === p.id);
    return `
      <div class="col-12">
        <div class="card cart-card p-3 shadow-sm d-flex flex-column flex-md-row align-items-center">
          <img src="${prod.imagen}" alt="${prod.nombre}" class="cart-img me-md-4 mb-3 mb-md-0">

          <div class="flex-grow-1 w-100 text-center text-md-start">
            <h5 class="mb-1">${prod.nombre}</h5>
            <p class="mb-1">Precio: $${prod.precio}</p>
            <p class="mb-1">Subtotal: $${(prod.precio * p.qty).toFixed(2)}</p>

            <div class="d-flex flex-column flex-sm-row justify-content-center justify-content-md-start align-items-center gap-2 mt-2">
              <button class="qty-btn btn btn-sm btn-outline-secondary" data-id="${p.id}" data-delta="-1">−</button>
              <span>${p.qty}</span>
              <button class="qty-btn btn btn-sm btn-outline-secondary" data-id="${p.id}" data-delta="1">+</button>

              <button class="remove-btn btn btn-sm  ms-sm-3" data-id="${p.id}" aria-label="Eliminar">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
        </div>
      </div>`;
  }).join('');

  totalEl.textContent = `$${cartTotal()}`;

  // Listeners (+ / − / 🗑)
  cont.querySelectorAll('.qty-btn').forEach(btn =>
    btn.addEventListener('click', () =>
      changeQty(Number(btn.dataset.id), Number(btn.dataset.delta))
    )
  );
  cont.querySelectorAll('.remove-btn').forEach(btn =>
    btn.addEventListener('click', () => removeItem(Number(btn.dataset.id)))
  );
}

/* =========================================================
   CONTADOR EN EL ICONO DEL CARRITO (NAVBAR)
========================================================= */
function updateCartBadge() {
  const count = getCart().reduce((acc, p) => acc + p.qty, 0);
  const badge = document.getElementById('cart-count');
  if (!badge) return;

  if (count > 0) {
    badge.textContent = count;
    badge.classList.remove('d-none');
  } else {
    badge.classList.add('d-none');  // Oculta badge si está vacío
  }
}

/* =========================================================
   INIT
========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();           // Siempre
  renderMenu();                // Solo hace algo en menu.html
  renderCartPage();            // Solo hace algo en carrito.html

  // Botón “Vaciar” en la página carrito
  const vaciarBtn = document.getElementById('vaciar-cart-page');
  if (vaciarBtn) vaciarBtn.addEventListener('click', clearCart);
});
