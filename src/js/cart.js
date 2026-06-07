import {
  getLocalStorage,
  setLocalStorage,
  loadHeaderFooter,
} from "./utils.mjs";
import { renderWishlist } from "./wishlist.js";

renderWishlist();

export function updateCartCount() {
  const cartItems = getLocalStorage("so-cart") || [];
  const totalCount = cartItems.reduce((sum, item) => sum + (item.Quantity || 1), 0);
  const badge = document.getElementById("cart-count");
  if (badge) {
    badge.textContent = totalCount;
    badge.style.display = totalCount > 0 ? "flex" : "none";
  }
}

function cartItemTemplate(item) {
  const imageUrl = item.Images?.PrimaryMedium || "";

  return `<li class="cart-card divider" data-id="${item.Id}">
    <span class="cart-card__remove" data-id="${item.Id}">❌</span>
    <a href="/product_pages/?product=${item.Id}" class="cart-card__image">
      <img src="${imageUrl}" alt="${item.Name}" />
    </a>
    <a href="/product_pages/?product=${item.Id}">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors?.[0]?.ColorName || ""}</p>

    <div class="cart-card__quantity-controls">
      <button class="quantity-btn decrease" data-id="${item.Id}">-</button>
      <span class="cart-card__quantity">qty: ${item.Quantity || 1}</span>
      <button class="quantity-btn increase" data-id="${item.Id}">+</button>
    </div>
    
    <p class="cart-card__price">$${item.FinalPrice}</p>
  </li>`;
}

<<<<<<< HEAD
function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const cartList = document.querySelector(".product-list.cart-list");
  const totalElements = document.querySelectorAll(".cart-total span, #cart-total");
  const cartFooter = document.querySelector(".cart-footer");
=======
renderCartContents()
// import { getLocalStorage, renderListWithTemplate, loadHeaderFooter } from "./utils.mjs";
>>>>>>> 4c65ac6303e7df835cc66c744766769559531746

  if (!cartList) return;

  if (cartItems.length === 0) {
    cartList.innerHTML = "<li><b>Your cart is empty</b></li>";
    totalElements.forEach(el => el.textContent = "0.00");
    if (cartFooter) cartFooter.classList.add("hid");
    return;
  }

  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  cartList.innerHTML = htmlItems.join("");

  const total = cartItems.reduce((sum, item) => sum + (item.FinalPrice * (item.Quantity || 1)), 0);
  totalElements.forEach(el => el.textContent = total.toFixed(2));

  if (cartFooter) {
    cartFooter.classList.remove("hid");
  }
}

// Delegación de eventos: un solo listener para todo el contenedor
function setupCartListeners() {
  const cartList = document.querySelector(".product-list.cart-list");
  if (!cartList) return;

  cartList.addEventListener("click", (event) => {
    const target = event.target;
    const productId = target.getAttribute("data-id");

    if (target.classList.contains("increase")) {
      updateQuantity(productId, 1);
    } else if (target.classList.contains("decrease")) {
      updateQuantity(productId, -1);
    } else if (target.classList.contains("cart-card__remove")) {
      removeFromCart(productId);
    }
  });
}

function updateQuantity(productId, change) {
  let cartItems = getLocalStorage("so-cart") || [];
  const itemIndex = cartItems.findIndex((item) => String(item.Id) === String(productId));

  if (itemIndex !== -1) {
    cartItems[itemIndex].Quantity = (cartItems[itemIndex].Quantity || 1) + change;
    
    // Si la cantidad llega a 0, eliminar el producto
    if (cartItems[itemIndex].Quantity <= 0) {
      cartItems.splice(itemIndex, 1);
    }
  }

  setLocalStorage("so-cart", cartItems);
  renderCartContents();
  updateCartCount();
}

function removeFromCart(productId) {
  let cartItems = getLocalStorage("so-cart") || [];
  cartItems = cartItems.filter((item) => String(item.Id) !== String(productId));

  setLocalStorage("so-cart", cartItems);
  renderCartContents();
  updateCartCount();
}

loadHeaderFooter().then(() => {
  renderCartContents();
  updateCartCount();
  setupCartListeners(); // Inicializamos los listeners una vez
});