import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./checkoutprocess.mjs";

loadHeaderFooter().then(() => {
    const checkout = new CheckoutProcess("so-cart", ".checkout-container");
    checkout.init();
    checkout.calculateOrderTotal();

    const zipInput = document.getElementById("zip");
    if (zipInput) {
        zipInput.addEventListener("blur", () => {
            checkout.calculateOrderTotal();
        });
    }

    const form = document.getElementById("checkout-form");
    const submitBtn = document.getElementById("checkout-submit");
    if (submitBtn && form) {
        submitBtn.addEventListener("click", (event) => {
            event.preventDefault();
            const chk_status = form.checkValidity();
            form.reportValidity();
            if (chk_status) {
                checkout.checkout(form);
            }
        });
    }
});