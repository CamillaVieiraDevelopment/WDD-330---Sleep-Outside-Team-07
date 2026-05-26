import {
  getLocalStorage,
  setLocalStorage,
  loadHeaderFooter,
} from "./utils.mjs";

// Function to update the cart count badge in the header
export function updateCartCount() {
  const cartItems = getLocalStorage("so-cart") || [];
  // CAMBIO: Sumar la propiedad Quantity de cada artículo en lugar de usar .length
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
    
    <p class="cart-card__quantity">qty: ${item.Quantity || 1}</p>
    
    <p class="cart-card__price">$${item.FinalPrice}</p>
  </li>`;
}

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const cartList = document.querySelector(".product-list.cart-list");
  const totalElement = document.getElementById("cart-total");

  if (!cartList) return;

  // If the cart is empty
  if (cartItems.length === 0) {
    cartList.innerHTML = "<li><b>Your cart is empty</b></li>";
    if (totalElement) totalElement.textContent = "0.00";
    return;
  }

  // 1. Render items using the template with the X
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  cartList.innerHTML = htmlItems.join("");

  // 2. CAMBIO: Calcular el total multiplicando el FinalPrice por la Quantity de cada artículo
  const total = cartItems.reduce((sum, item) => sum + (item.FinalPrice * (item.Quantity || 1)), 0);

  // 3. Insert the formatted total into Aaron's element
  if (totalElement) {
    totalElement.textContent = total.toFixed(2);
  }

  // 4. Activate the X button listeners
  attachRemoveListeners();
}

function attachRemoveListeners() {
  const removeButtons = document.querySelectorAll(".cart-card__remove");
  removeButtons.forEach((button) => {
    button.addEventListener("click", removeFromCart);
  });
}

function removeFromCart(event) {
  const productId = event.target.getAttribute("data-id");
  let cartItems = getLocalStorage("so-cart") || [];

  // Finds the index of the clicked item
  const itemIndex = cartItems.findIndex((item) => item.Id === productId);

  if (itemIndex !== -1) {
    // TIP DE UX: Si la cantidad es mayor a 1, restamos uno en vez de eliminar la fila completa
    if (cartItems[itemIndex].Quantity > 1) {
      cartItems[itemIndex].Quantity -= 1;
    } else {
      cartItems.splice(itemIndex, 1); // Si solo quedaba uno, removemos la fila
    }
    
    setLocalStorage("so-cart", cartItems); // Saves to LocalStorage
    renderCartContents(); // Updates the screen and recalculates the total
    updateCartCount(); // Updates the cart count badge
  }
}

// Ensures the Header/Footer is loaded before rendering the cart
loadHeaderFooter().then(() => {
  renderCartContents();
  updateCartCount();
});