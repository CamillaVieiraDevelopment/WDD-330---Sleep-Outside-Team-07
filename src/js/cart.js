<<<<<<< HEAD
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

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const cartList = document.querySelector(".product-list.cart-list");
  const totalElements = document.querySelectorAll(".cart-total span, #cart-total");
  const cartFooter = document.querySelector(".cart-footer");

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
=======

import { getLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");

  // Check if the cart is null or empty
  if (!cartItems || cartItems.length === 0) {
    document.querySelector(".product-list").innerHTML =
      "<p><b>Your cart is empty</b></p>";
  } else {
    // 1. Render the cart items
    const htmlItems = cartItems.map((item) => cartItemTemplate(item));
    document.querySelector(".product-list").innerHTML = htmlItems.join("");

    // 2. Calculate the total by summing the FinalPrice of each item
    // The .reduce() method is perfect for summing values in an array!
    const total = cartItems.reduce((sum, item) => sum + item.FinalPrice, 0);

    // 3. Select the elements created in the HTML
    const cartFooter = document.querySelector(".cart-footer");
    const cartTotalElement = document.querySelector(".cart-total");

    // 4. Remove the 'hide' class to display the footer
    cartFooter.classList.remove("hide");

    // 5. Insert the total value formatted to 2 decimal places
    cartTotalElement.innerHTML = `Total: $${total.toFixed(2)}`;
  }
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

renderCartContents();
// import { getLocalStorage, renderListWithTemplate, loadHeaderFooter } from "./utils.mjs";

// function cartItemTemplate(item) {
//   // Ajuste de ruta de imagen (por si viene con "../")
//   const imageUrl = item.Image?.replace(/^\.\.\//, "/") || "";
//   return `<li class="cart-card divider" data-id="${item.Id}">
//     <a href="/product_pages/?product=${item.Id}" class="cart-card__image">
//       <img src="${imageUrl}" alt="${item.Name}" />
//     </a>
//     <a href="/product_pages/?product=${item.Id}">
//       <h2 class="card__name">${item.Name}</h2>
//     </a>
//     <p class="cart-card__color">${item.Colors?.[0]?.ColorName || ""}</p>
//     <p class="cart-card__quantity">qty: 1</p>
//     <p class="cart-card__price">$${item.FinalPrice}</p>
//   </li>`;
// }

// function renderCartContents() {
//   const cartItems = getLocalStorage("so-cart") || [];
//   const cartList = document.querySelector(".product-list.cart-list");
//   if (!cartList) return;

//   if (cartItems.length === 0) {
//     cartList.innerHTML = "<li><b>Your cart is empty</b></li>";
//     document.getElementById("cart-total").textContent = "0.00";
//     return;
//   }

//   // Renderizar los items
//   renderListWithTemplate(cartItemTemplate, cartList, cartItems, "afterbegin", true);
  
//   // Calcular y mostrar el total
//   const total = cartItems.reduce((sum, item) => sum + item.FinalPrice, 0);
//   document.getElementById("cart-total").textContent = total.toFixed(2);
// }

// // Cargar header y footer dinámicos
// loadHeaderFooter().then(() => {
//   renderCartContents();
// });
>>>>>>> jg--individual2
