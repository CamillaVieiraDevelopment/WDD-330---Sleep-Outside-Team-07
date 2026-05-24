// Home page now only initializes global components
import { loadHeaderFooter } from "./utils.mjs";
import { updateCartCount } from "./cart.js";

loadHeaderFooter().then(() => {
  updateCartCount();
});

