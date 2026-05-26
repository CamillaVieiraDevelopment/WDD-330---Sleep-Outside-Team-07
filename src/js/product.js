// Removed the set/get LocalStorage from here and imported getParam and our new ProductDetails class.
// Following ES Modules principles, this file only orchestrates dependencies and starts the process.
import { getParam } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductDetails from "./ProductDetails.mjs";
import { loadHeaderFooter } from "./utils.mjs";
import { updateCartCount } from "./cart.js";

loadHeaderFooter().then(() => {
  updateCartCount();
});

//Retrieve the ID from the URL (e.g., 880RR)
const productId = getParam("product");
const dataSource = new ExternalServices("tents");


// Create an instance of our new class, passing the ID and the data access layer
const product = new ProductDetails(productId, dataSource);


// We start the process of fetching data and rendering the screen
product.init();
