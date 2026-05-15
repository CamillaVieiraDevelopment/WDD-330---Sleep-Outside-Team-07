// 1. Import the necessary tools
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

// 2. Create the "DataSource" instance (where the data comes from)
// We want the 'tents' category
const dataSource = new ProductData("tents");

// 3. Select where the list will appear in the HTML
// In your index.html, there should be a <ul> or <section> with the class .product-list
const listElement = document.querySelector(".product-list");

// 4. Create the "ProductList" instance (what builds the list)
// We pass the category, the data source, and the element where it will be rendered
const myList = new ProductList("tents", dataSource, listElement);

// 5. Start the process
myList.init();