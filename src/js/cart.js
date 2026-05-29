import { getLocalStorage, renderListWithTemplate, loadHeaderFooter } from "./utils.mjs";

function cartItemTemplate(item) {
  // Ajuste de ruta de imagen (por si viene con "../")
  const imageUrl = item.Image?.replace(/^\.\.\//, "/") || "";
  return `<li class="cart-card divider" data-id="${item.Id}">
    <a href="/product_pages/?product=${item.Id}" class="cart-card__image">
      <img src="${imageUrl}" alt="${item.Name}" />
    </a>
    <a href="/product_pages/?product=${item.Id}">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors?.[0]?.ColorName || ""}</p>
    <p class="cart-card__quantity">qty: 1</p>
    <p class="cart-card__price">$${item.FinalPrice}</p>
  </li>`;
}

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const cartList = document.querySelector(".product-list.cart-list");
  if (!cartList) return;

  if (cartItems.length === 0) {
    cartList.innerHTML = "<li><b>Your cart is empty</b></li>";
    document.getElementById("cart-total").textContent = "0.00";
    return;
  }

  // Renderizar los items
  renderListWithTemplate(cartItemTemplate, cartList, cartItems, "afterbegin", true);

  // Calcular y mostrar el total
  const total = cartItems.reduce((sum, item) => sum + item.FinalPrice, 0);
  document.getElementById("cart-total").textContent = total.toFixed(2);
}

// Cargar header y footer dinámicos
loadHeaderFooter().then(() => {
  renderCartContents();
});