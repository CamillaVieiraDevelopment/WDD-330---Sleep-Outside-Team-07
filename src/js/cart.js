
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

renderCartContents()
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