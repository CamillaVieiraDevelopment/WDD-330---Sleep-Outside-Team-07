import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  // Esto quita el "../" del inicio de la ruta si es que existe
  const imagePath = product.Image.replace("../", "");

  return `<li class="product-card">
    <a href="product_pages/index.html?product=${product.Id}">
      <img src="${imagePath}" alt="Image of ${product.Name}">
      <h3 class="card__brand">${product.Brand.Name}</h3>
      <h2 class="card__name">${product.Name}</h2>
      <p class="product-card__price">$${product.ListPrice}</p>
    </a>
  </li>`;
}

export default class ProductList {
    // 1. El Constructor: Configura la "misión" de la clase
    constructor(category, dataSource, listElement) {
        this.category = category;      // Ej: "tents"
        this.dataSource = dataSource;  // La instancia de ProductData
        this.listElement = listElement;// El elemento del DOM (ej: un <ul>)
    }

    // 2. El método init: Pone todo en marcha
    async init() {
        // Esperamos a que el dataSource obtenga los datos del JSON
        const list = await this.dataSource.getData();
        //Llamamos el metodo de renderizado pasandole la lista de productos
        this.renderList(list);
    }

    // Aquí llamaremos a los métodos de renderizado en el futuro
    // this.renderList(list);
   renderList(list) {
    // 3. REFACTORIZACIÓN: Usas la función de utils.mjs
    // Pasamos: la función del template, el elemento del DOM, la lista de datos, 
    // la posición y 'true' para limpiar el contenedor (esto quita las cards extra).
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }


}
