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