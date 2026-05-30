const baseURL = "https://wdd330-backend.onrender.com/";

async function convertToJson(res) {
  // Converts the response before checking if everything is OK to capture API messages
  const jsonResponse = await res.json();

  if (res.ok) {
    return jsonResponse;
  } else {
    // Throws a custom object with a name and the structured message from the server
    throw { name: "servicesError", message: jsonResponse };
  }
}

export default class ExternalServices {
  constructor() { }

  async getData(category) {
    const response = await fetch(baseURL + `products/search/${category}`);
    return await convertToJson(response).then(data => data.Result);
  }

  async findProductById(id) {
    const response = await fetch(baseURL + `product/${id}`);
    return await convertToJson(response).then(data => data.Result);
  }

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