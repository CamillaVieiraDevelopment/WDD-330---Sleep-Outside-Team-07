import { getLocalStorage, setLocalStorage } from "./utils.mjs";

// 1. Renderizar la lista en pantalla
export function renderWishlist() {
  const wishlistItems = getLocalStorage("so-wishlist") || [];
  const element = document.getElementById("wishlist-list");

  if (!element) return; // Evita errores si no estamos en la página correcta

  if (wishlistItems.length === 0) {
    element.innerHTML = "<p>Your wishlist is empty.</p>";
    return;
  }

  // Generar el HTML para cada producto de la wishlist
  const htmlItems = wishlistItems.map((item) => `
    <li class="wishlist-card">
      <img src="${item.Images.PrimaryMedium || item.Images.PrimaryLarge}" alt="${item.NameWithoutBrand}">
      <h3>${item.Brand.Name} ${item.NameWithoutBrand}</h3>
      <p class="price">$${item.FinalPrice}</p>
      <div class="wishlist-buttons">
        <button class="btn-move-to-cart" data-id="${item.Id}">🛒 Move to Cart</button>
        <button class="btn-remove-wishlist" data-id="${item.Id}">❌ Remove</button>
      </div>
    </li>
  `).join("");

  element.innerHTML = htmlItems;

  // Añadir los listeners a los nuevos botones generados
  attachWishlistEvents();
}

// 2. Escuchar los clics de "Mover" y "Eliminar"
function attachWishlistEvents() {
  document.querySelectorAll(".btn-move-to-cart").forEach(button => {
    button.addEventListener("click", (e) => {
      const productId = e.target.getAttribute("data-id");
      moveToCart(productId);
    });
  });

  document.querySelectorAll(".btn-remove-wishlist").forEach(button => {
    button.addEventListener("click", (e) => {
      const productId = e.target.getAttribute("data-id");
      removeFromWishlist(productId);
    });
  });
}

// 3. LÓGICA CLAVE: Mover de Wishlist a Cart
function moveToCart(productId) {
  let wishlist = getLocalStorage("so-wishlist") || [];
  let cart = getLocalStorage("so-cart") || [];

  // Encontrar el producto en la wishlist
  const productIndex = wishlist.findIndex(item => item.Id === productId);

  if (productIndex !== -1) {
    const product = wishlist[productIndex];

    // Verificar si ya existe en el carrito para sumar cantidad o agregarlo de cero
    const existingCartItem = cart.find(item => item.Id === productId);
    if (existingCartItem) {
      existingCartItem.Quantity = (existingCartItem.Quantity || 1) + 1;
    } else {
      product.Quantity = 1;
      cart.push(product);
    }

    // Eliminar de la wishlist
    wishlist.splice(productIndex, 1);

    // Guardar los cambios actualizados en LocalStorage
    setLocalStorage("so-wishlist", wishlist);
    setLocalStorage("so-cart", cart);

    // Refrescar la pantalla para mostrar los cambios en ambas listas
    renderWishlist();
    
    // Si estás en la página del carrito, aquí también deberías mandar a 
    // llamar la función que vuelve a pintar tu carrito y actualiza el Badge.
    location.reload(); // Truco rápido para refrescar todo el estado de la página
  }
}

// 4. Eliminar directamente de la Wishlist
function removeFromWishlist(productId) {
  let wishlist = getLocalStorage("so-wishlist") || [];
  wishlist = wishlist.filter(item => item.Id !== productId);
  setLocalStorage("so-wishlist", wishlist);
  renderWishlist();
}