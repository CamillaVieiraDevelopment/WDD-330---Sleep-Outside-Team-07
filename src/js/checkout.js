import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./checkoutprocess.mjs";

// Ensures the header and footer load before initiating the checkout
loadHeaderFooter().then(() => {
    // Instantiates the class, passing the localStorage key and the HTML container selector
    const checkout = new CheckoutProcess("so-cart", ".checkout-container");
    checkout.init();

    // Listens for when the user leaves the ZIP Code field to calculate totals dynamically
    const zipInput = document.getElementById("zip");
    if (zipInput) {
        zipInput.addEventListener("blur", () => {
            checkout.calculateOrderTotal();
        });
    }

    // CORREÇÃO: Escuta o evento submit do formulário de maneira independente do zipInput
    const form = document.getElementById("checkout-form");
    if (form) {
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            checkout.checkout(form);
        });
    }
});