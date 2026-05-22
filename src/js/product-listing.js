import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter } from "./utils.mjs";

// Load the header and footer audio on this page as well.
loadHeaderFooter();

// Instantiates the data source and list for the tents category.
const dataSource = new ProductData("tents");
const listElement = document.querySelector(".product-list");

const productList = new ProductList("tents", dataSource, listElement);
productList.init();