// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}


// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}


// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}


// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}


// [Adicionated] Function for  capture param of URL
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}


export function renderListWithTemplate(templateFn, parentElement, list, position = "afterbegin", clear = false) {
  if (clear) {
    parentElement.innerHTML = "";
  }
  const htmlStrings = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

// utils.mjs

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("/partials/header.html");
  const footerTemplate = await loadTemplate("/partials/footer.html");
  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");

  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);
}

// Add this function to the end of your existing utils.mjs file
export function alertMessage(message, scroll = true) {
  // Creates the custom alert container
  const alert = document.createElement("div");
  alert.classList.add("alert");
  alert.style.cssText = "background-color: #f8d7da; color: #721c24; padding: 1rem; margin: 1rem 0; border: 1px solid #f5c6cb; border-radius: 4px; display: flex; justify-content: space-between; align-items: center;";

  // Sets the content with the message and the close button (X)
  alert.innerHTML = `<span>${message}</span><span class="alert-close" style="cursor:pointer; font-weight:bold; margin-left:1rem;">X</span>`;

  // Adds the listener to close the alert when the 'X' is clicked
  alert.addEventListener("click", function (e) {
    if (e.target.classList.contains("alert-close")) {
      const main = document.querySelector("main");
      main.removeChild(this);
    }
  });

  // Inserts the alert at the top of the main element
  const main = document.querySelector("main");
  if (main) {
    main.prepend(alert);
  }

  // If scroll is true, scrolls the page back to the top
  if (scroll) {
    window.scrollTo(0, 0);
  }
}