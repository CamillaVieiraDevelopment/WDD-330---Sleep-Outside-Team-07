import { getLocalStorage, alertMessage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices();

function packageItems(items) {
    return items.map((item) => ({
        id: item.Id,
        name: item.Name,
        price: item.FinalPrice,
        quantity: item.Quantity || 1
    }));
}

export default class CheckoutProcess {
    constructor(key, outputSelector) {
        this.key = key;
        this.outputSelector = outputSelector;
        this.list = [];
        this.itemTotal = 0;
        this.shipping = 0;
        this.tax = 0;
        this.orderTotal = 0;
    }

    init() {
        this.list = getLocalStorage(this.key) || [];
        this.calculateItemSubTotal();
    }

    calculateItemSubTotal() {
        this.itemTotal = this.list.reduce(
            (sum, item) => sum + ((item.FinalPrice || item.Price) * (item.Quantity || 1)),
            0
        );
        const subtotalElement = document.querySelector(`${this.outputSelector} #subtotal`);
        if (subtotalElement) {
            subtotalElement.innerText = `$${this.itemTotal.toFixed(2)}`;
        }
    }

    calculateOrderTotal() {
        const totalItems = this.list.reduce((sum, item) => sum + (item.Quantity || 1), 0);
        if (totalItems > 0) {
            this.shipping = 10 + (totalItems - 1) * 2;
        } else {
            this.shipping = 0;
        }
        this.tax = this.itemTotal * 0.06;
        this.orderTotal = this.itemTotal + this.shipping + this.tax;
        this.displayOrderTotals();
    }

    displayOrderTotals() {
        const shippingElement = document.querySelector(`${this.outputSelector} #shipping`);
        const taxElement = document.querySelector(`${this.outputSelector} #tax`);
        const totalElement = document.querySelector(`${this.outputSelector} #order-total`);

        if (shippingElement) shippingElement.innerText = `$${this.shipping.toFixed(2)}`;
        if (taxElement) taxElement.innerText = `$${this.tax.toFixed(2)}`;
        if (totalElement) totalElement.innerText = `$${this.orderTotal.toFixed(2)}`;
    }

    async checkout(formElement) {
        this.calculateOrderTotal();

        const formData = new FormData(formElement);
        const formJson = Object.fromEntries(formData.entries());

        const payload = {
            ...formJson,
            orderDate: new Date().toISOString(),
            items: packageItems(this.list),
            orderTotal: this.orderTotal.toFixed(2),
            shipping: this.shipping,
            tax: this.tax.toFixed(2)
        };

        //Stretch Goals: Involves execution within the try/catch block and consumes alertMessage
        try {
            const response = await services.checkout(payload);
            console.log("Order success:", response);

            // Clears the local cart
            localStorage.removeItem(this.key);

            // Redirects the user to the created success page
            window.location.href = "success.html";
        } catch (error) {
            console.error("Captured error:", error);

            // Iterates through the error keys returned from the server if there is a message object
            if (error.name === "servicesError" && typeof error.message === "object") {
                // Removes any old generic message and splits each backend error into individual alerts
                for (const key in error.message) {
                    alertMessage(`${key}: ${error.message[key]}`);
                }
            } else {
                alertMessage("An error occurred during checkout. Please verify your details.");
            }
        }
    }
}