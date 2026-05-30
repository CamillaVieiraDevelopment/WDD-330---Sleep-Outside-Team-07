import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

loadHeaderFooter();

const category = getParam("category");
const searchTerm = getParam("search");
const element = document.querySelector(".product-list");
const titleElement = document.querySelector(".products h2") || document.querySelector(".title");

// Función para normalizar texto (minúsculas, sin espacios extra)
function normalizeString(str) {
  return str.toLowerCase().trim();
}

// Función que filtra productos según el término de búsqueda
function filterProductsBySearch(products, term) {
  const normalizedTerm = normalizeString(term);
  return products.filter(product => {
    const name = normalizeString(product.Name);
    const nameWithoutBrand = normalizeString(product.NameWithoutBrand);
    const brand = normalizeString(product.Brand?.Name || "");
    return name.includes(normalizedTerm) ||
           nameWithoutBrand.includes(normalizedTerm) ||
           brand.includes(normalizedTerm);
  });
}

// Función para cargar todas las categorías y combinarlas
async function loadAllProducts() {
  const categories = ["tents", "backpacks", "sleeping-bags", "hammocks"];
  const services = new ExternalServices();
  // Cargar todas las categorías en paralelo
  const promises = categories.map(cat => services.getData(cat).catch(err => {
    console.warn(`Error loading category ${cat}:`, err);
    return []; // si falla, devolver array vacío
  }));
  const results = await Promise.all(promises);
  // Combinar todos los productos en un solo array
  return results.flat();
}

async function init() {
  if (searchTerm) {
    // Modo búsqueda
    // Mostrar título de búsqueda
    if (titleElement) {
      titleElement.innerHTML = `Search results for: "${searchTerm}"`;
    }
    // Cargar todos los productos
    const allProducts = await loadAllProducts();
    const filtered = filterProductsBySearch(allProducts, searchTerm);
    
    if (filtered.length === 0) {
      // Mostrar mensaje de no resultados
      element.innerHTML = `<li class="no-results">No products found for "${searchTerm}". Try a different term.</li>`;
      return;
    }
    
    // Usar ProductList solo para renderizar, pero sin volver a cargar datos
    // Creamos una instancia temporal para aprovechar renderList
    const tempList = new ProductList(null, null, element);
    tempList.renderList(filtered);
  } 
  else if (category) {
    // Modo normal por categoría
    const formattedTitle = category
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    if (titleElement) {
      titleElement.innerHTML = `Top Products: ${formattedTitle}`;
    }
    const dataSource = new ExternalServices();
    const productList = new ProductList(category, dataSource, element);
    productList.init();
  }
  else {
    // Si no hay categoría ni búsqueda, mostrar mensaje o redirigir
    if (titleElement) {
      titleElement.innerHTML = "Products";
    }
    element.innerHTML = `<li class="no-results">Please select a category or use the search box.</li>`;
  }
}

init();