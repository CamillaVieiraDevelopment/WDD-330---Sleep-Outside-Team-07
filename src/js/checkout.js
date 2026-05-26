import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

// Load structural header and footer elements
loadHeaderFooter();

// Initialize the class pointing to the LocalStorage key and the summary list selector
const myCheckout = new CheckoutProcess("so-cart", ".order-summary");
myCheckout.init();

// Listen for changes in the ZIP code field to calculate shipping and taxes automatically
const zipInput = document.getElementById("zip");
if (zipInput) {
    zipInput.addEventListener("blur", () => {
        // Ensure the calculation only runs if something is entered in the ZIP code field
        if (zipInput.value.trim() !== "") {
            myCheckout.calculateOrderTotal();
        }
    });
}