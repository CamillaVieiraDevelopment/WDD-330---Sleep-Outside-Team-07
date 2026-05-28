// main.js
import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter } from "./utils.mjs";
import { updateCartCount } from "./cart.js";
import Alert from "./Alert.js";          

loadHeaderFooter().then(() => {
  updateCartCount();
  const alerts = new Alert();
  alerts.init();
});

loadHeaderFooter().then(() => {
  updateCartCount();
});

const dataSource = new ExternalServices("tents");
const element = document.querySelector(".product-list");

if (element) {
  const productList = new ProductList("tents", dataSource, element);
  productList.init();
}