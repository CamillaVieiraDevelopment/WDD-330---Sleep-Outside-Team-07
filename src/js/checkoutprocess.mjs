import { getLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

// Instancia os serviços externos para fazer o POST depois
const services = new ExternalServices();

// Função auxiliar (Passo 6.1) para transformar o carrinho no formato que a API exige
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

    // Prepare and send the form data to the server 
    // Método de checkout atualizado para evitar erros de validação
    async checkout(formElement) {
        // CORREÇÃO CRÍTICA: Garante que os totais estejam calculados antes de enviar,
        // mesmo que o usuário não tenha disparado o evento 'blur' no campo de CEP.
        this.calculateOrderTotal();

        // Converte os campos preenchidos do formulário em um objeto JS comum
        const formData = new FormData(formElement);
        const formJson = Object.fromEntries(formData.entries());

        // Monta o objeto completo no formato exato que a API exige
        const payload = {
            ...formJson,
            orderDate: new Date().toISOString(),
            items: packageItems(this.list),
            orderTotal: this.orderTotal.toFixed(2),
            shipping: this.shipping,
            tax: this.tax.toFixed(2)
        };

        console.log("Enviando este payload para o servidor:", payload);

        try {
            // Envia para o método checkout criado no ExternalServices.mjs
            const response = await services.checkout(payload);
            console.log("Sucesso! Resposta do servidor:", response);
            alert("Pedido realizado com sucesso!");

            // Limpa o carrinho após o sucesso (Opcional para esta etapa)
            // localStorage.removeItem(this.key);

        } catch (error) {
            // MELHORIA DE DEBUG: Imprime o erro detalhado vindo do servidor diretamente no console
            console.error("Erro detalhado retornado pelo servidor:", error.message);

            // Tenta exibir a mensagem amigável do servidor se ela existir
            const msgServidor = error.message?.message || "Verifique se todos os campos estão preenchidos corretamente.";
            alert(`Erro no checkout: ${msgServidor}`);
        }
    }
}