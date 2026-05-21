import { getLocalStorage, setLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  const productListElement = document.querySelector(".product-list");

  // Checks if the cart is null or empty
  if (!cartItems || cartItems.length === 0) {
    productListElement.innerHTML = "<p><b>Your cart is empty</b></p>";
    // Hides the total footer if the cart is emptied
    document.querySelector(".cart-footer").classList.add("hide");
  } else {
    // 1. Renders the cart items
    const htmlItems = cartItems.map((item) => cartItemTemplate(item));
    productListElement.innerHTML = htmlItems.join("");

    // 2. Calculates the total by summing the FinalPrice of each item
    const total = cartItems.reduce((sum, item) => sum + item.FinalPrice, 0);

    // 3. Selects the elements created in the HTML
    const cartFooter = document.querySelector(".cart-footer");
    const cartTotalElement = document.querySelector(".cart-total");

    // 4. Removes the 'hide' class to display the footer
    cartFooter.classList.remove("hide");

    // 5. Inserts the formatted total value
    cartTotalElement.innerHTML = `Total: $${total.toFixed(2)}`;

    // 6. Activates event listeners for the remove buttons
    attachRemoveListeners();
  }
}

function cartItemTemplate(item) {
  // Inject the ❌ button containing the data-id of the corresponding product
  const newItem = `<li class="cart-card divider">
  <span class="cart-card__remove" data-id="${item.Id}">❌</span>
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

// Function to map all remove buttons and add the click event
function attachRemoveListeners() {
  const removeButtons = document.querySelectorAll(".cart-card__remove");
  removeButtons.forEach((button) => {
    button.addEventListener("click", removeFromCart);
  });
}

// Function responsible for removing the item from localStorage and updating the screen
function removeFromCart(event) {
  const productId = event.target.getAttribute("data-id");
  let cartItems = getLocalStorage("so-cart") || [];

  // Finds the index of the first item that matches the clicked ID
  // Using findIndex + splice ensures that if there are duplicate items, we only remove one at a time
  const itemIndex = cartItems.findIndex((item) => item.Id === productId);

  if (itemIndex !== -1) {
    // Removes the specific item found at the array index
    cartItems.splice(itemIndex, 1);

    // Updates localStorage with the new item list
    setLocalStorage("so-cart", cartItems);

    // Re-renders the cart content to update the interface and total value instantly
    renderCartContents();
  }
}

renderCartContents();