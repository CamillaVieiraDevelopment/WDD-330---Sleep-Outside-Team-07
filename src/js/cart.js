import {
  getLocalStorage,
  setLocalStorage,
  loadHeaderFooter,
} from "./utils.mjs";

// Function to update the cart count badge in the header
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
  
      <span class="cart-card__quantity">
        qty: ${item.Quantity || 1}
      </span>

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

  // If the cart is empty
  if (cartItems.length === 0) {
    cartList.innerHTML = "<li><b>Your cart is empty</b></li>";
    totalElements.forEach(el => el.textContent = "0.00");
    if (cartFooter) cartFooter.classList.add("hid");
    return;
  }

  // 1. Render items using the template with the X
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  cartList.innerHTML = htmlItems.join("");

  // 2. Calcular el total multiplicando el FinalPrice por la Quantity de cada artículo
  const total = cartItems.reduce((sum, item) => sum + (item.FinalPrice * (item.Quantity || 1)), 0);

  // 3. Insert the formatted total into all total elements safely
  totalElements.forEach(el => el.textContent = total.toFixed(2));

  // CORREÇÃO: Mostra o rodapé com o botão de checkout removendo a classe 'hid'
  if (cartFooter) {
    cartFooter.classList.remove("hid");
  }

  // 4. Activate the X and quantity button listeners
  attachRemoveListeners();
  attachQuantityListeners();

  function attachQuantityListeners() {
    const increaseButtons = document.querySelectorAll(".increase");
    const decreaseButtons = document.querySelectorAll(".decrease");

    increaseButtons.forEach((button) => {
      button.addEventListener("click", increaseQuantity);
    });

    decreaseButtons.forEach((button) => {
      button.addEventListener("click", decreaseQuantity);
    });
  }

  function increaseQuantity(event) {
    const productId = event.target.getAttribute("data-id");
    let cartItems = getLocalStorage("so-cart") || [];

    const item = cartItems.find((item) => item.Id === productId);

    if (item) {
      item.Quantity = (item.Quantity || 1) + 1;
    }

    setLocalStorage("so-cart", cartItems);
    renderCartContents();
    updateCartCount();
  }

  function decreaseQuantity(event) {
    const productId = event.target.getAttribute("data-id");
    let cartItems = getLocalStorage("so-cart") || [];

    const itemIndex = cartItems.findIndex((item) => item.Id === productId);

    if (itemIndex !== -1) {
      if (cartItems[itemIndex].Quantity > 1) {
        cartItems[itemIndex].Quantity -= 1;
      } else {
        cartItems.splice(itemIndex, 1);
      }
    }

    setLocalStorage("so-cart", cartItems);
    renderCartContents();
    updateCartCount();
  }
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

  const itemIndex = cartItems.findIndex((item) => item.Id === productId);

  if (itemIndex !== -1) {
    if (cartItems[itemIndex].Quantity > 1) {
      cartItems[itemIndex].Quantity -= 1;
    } else {
      cartItems.splice(itemIndex, 1);
    }

    setLocalStorage("so-cart", cartItems);
    renderCartContents();
    updateCartCount();
  }
}

// Ensures the Header/Footer is loaded before rendering the cart
loadHeaderFooter().then(() => {
  renderCartContents();
  updateCartCount();
});