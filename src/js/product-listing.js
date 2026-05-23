import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
// Adicionado o 'getParam' para capturar o parâmetro da URL
import { loadHeaderFooter, getParam } from "./utils.mjs";

loadHeaderFooter();

// Captura dinamicamente se é 'tents', 'backpacks', 'sleeping-bags' ou 'hammocks'
const category = getParam("category");

const dataSource = new ProductData();
const listElement = document.querySelector(".product-list");

// Agora passamos a variável 'category' em vez do texto fixo "tents"!
const myList = new ProductList(category, dataSource, listElement);
myList.init();