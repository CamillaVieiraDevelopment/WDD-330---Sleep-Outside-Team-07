// Official cloud server provided by the course guidelines
const baseURL = "https://wdd330-backend.onrender.com/";

async function convertToJson(res) {
  const data = await res.json();
  if (res.ok) {
    return data;
  } else {
    throw { name: "servicesError", message: data };
  }
}

export default class ExternalServices {
  constructor() { }

  // Fetches the product list directly from the external cloud API
  async getData(category) {
    const response = await fetch(baseURL + `products/search/${category}`);
    const data = await convertToJson(response);
    return data.Result; // Returns the product array (tents, backpacks, etc.)
  }

  // Fetches the details of a specific product by ID from the cloud
  async findProductById(id) {
    const response = await fetch(baseURL + `product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  // Checkout POST submission method created in Step 4/6
  async checkout(payload) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    const response = await fetch(baseURL + "checkout", options);
    return await convertToJson(response);
  }
}