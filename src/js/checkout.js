import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./checkoutprocess.mjs";

loadHeaderFooter().then(() => {
    const checkout = new CheckoutProcess("so-cart", ".checkout-container");
    checkout.init();

    const zipInput = document.getElementById("zip");
    if (zipInput) {
        zipInput.addEventListener("blur", () => {
            checkout.calculateOrderTotal();
        });
    }

    //Manual validation before invoking the asynchronous submission process
    const form = document.getElementById("checkout-form");
    const submitBtn = document.getElementById("checkout-submit");

    if (submitBtn && form) {
        submitBtn.addEventListener("click", (event) => {
            event.preventDefault();

            // Checks HTML5 rules (required, patterns)
            const chk_status = form.checkValidity();
            form.reportValidity();

            // Only executes the checkout if the form is 100% valid
            if (chk_status) {
                checkout.checkout(form);
            }
        });
    }
});