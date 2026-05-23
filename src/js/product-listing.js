import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

loadHeaderFooter();

// Captura a categoria vinda da URL
const category = getParam("category");

// STEP 8: Atualiza dinamicamente o título H2 da página
if (category) {
    // Captura o elemento h2 da página (usando a classe que adicionamos no HTML)
    const titleElement = document.querySelector(".title-heading");

    if (titleElement) {
        // Formata o texto para deixar a primeira letra maiúscula (ex: tents -> Tents)
        const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);

        // Altera o texto para o padrão exigido: "Top Products: Category"
        titleElement.textContent = `Top Products: ${formattedCategory}`;
    }
}

const dataSource = new ProductData();
const listElement = document.querySelector(".product-list");

const myList = new ProductList(category, dataSource, listElement);
myList.init();