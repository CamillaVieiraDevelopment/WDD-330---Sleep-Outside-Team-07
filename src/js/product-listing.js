import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
// Importamos loadHeaderFooter y también getParam para leer la URL
import { loadHeaderFooter, getParam } from "./utils.mjs";


loadHeaderFooter();

// we get the category from the URL ?category=backpacks, guardará "backpacks")
const category = getParam("category");

const dataSource = new ProductData(); // I removed the tents category
const element = document.querySelector(".product-list");

const productList = new ProductList(category, dataSource, element);
productList.init();

// change the title dinamically
if (category) {
    // convert sleeping-bags to sleeping bags
    const formattedTitle = category
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    const titleElement = document.querySelector(".products h2") || document.querySelector(".title");
    if (titleElement) {
        titleElement.innerHTML = `Top Products: ${formattedTitle}`;
    }
}