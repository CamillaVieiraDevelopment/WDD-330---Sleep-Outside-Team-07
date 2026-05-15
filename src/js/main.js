import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

// Instancia a fonte de dados e a lista [cite: 474, 490]
const dataSource = new ProductData("tents");
const listElement = document.querySelector(".product-list");

const productList = new ProductList("tents", dataSource, listElement);

productList.init();