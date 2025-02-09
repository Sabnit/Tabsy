import { createCategoryListEl, createUrlList, checkValidUrl } from "./utils.js";

// Input fields
const categoryInput = document.getElementById("category");
const urltitleInputEl = document.getElementById("url-title-input");
const urlInputEl = document.getElementById("url-input");

// Buttons
const addCategoryBtn = document.getElementById("add-category-btn");
const backBtn = document.getElementById("back-btn");
const saveUrlBtn = document.getElementById("save-url-btn");
const fetchTabBtn = document.getElementById("fetch-tab-btn");

// List elements
const categoryListEl = document.getElementById("category-list");
const urlListEl = document.getElementById("url-list");

// Section containers
const categorySection = document.getElementById("category-section");
const urlSection = document.getElementById("url-section");

// Category heading
const categoryHeading = document.getElementById("category-heading");

// Initialize category list from the localStorage
let categoryList = JSON.parse(localStorage.getItem("categoryList")) || [];

function initializeApp() {
  createCategoryListEl(categoryList, categoryListEl);
}

categoryListEl.addEventListener("click", (event) => {
  if (event.target.tagName === "LI") {
    let categoryName = event.target.textContent;

    categoryListEl.style.display = "none";
    backBtn.style.display = "block";

    categoryHeading.textContent = categoryName;
    displayCategoryUrls(categoryName, urlListEl);
  }
});

function displayCategoryUrls(categoryName, ulEl) {
  let storedUrl = Object.entries(
    JSON.parse(localStorage.getItem(categoryName))
  );

  createUrlList(storedUrl, ulEl);
  urlSection.style.display = "block";
  categorySection.style.display = "none";
}

// Save Category
addCategoryBtn.addEventListener("click", () => {
  let categoryName = categoryInput.value;

  // Validation
  if (!categoryName) {
    console.log("Category is empty");
    return;
  }

  categoryList.push(categoryName);

  localStorage.setItem("categoryList", JSON.stringify(categoryList));
  localStorage.setItem(categoryName, "{}"); // Store an empty object to prevent error

  createCategoryListEl(categoryList, categoryListEl);

  categoryInput.value = "";
});

// URL category
saveUrlBtn.addEventListener("click", () => {
  let titleInput = urltitleInputEl.value;
  let urlInput = urlInputEl.value;
  let activeCategory = categoryHeading.textContent;

  // validator
  if (!titleInput || !urlInput) {
    console.log("One of the input is empty");
    return;
  }

  // validator
  if (!checkValidUrl(urlInput)) {
    console.log("Invalid Url");
    return;
  }

  let storedUrl = Object.entries(
    JSON.parse(localStorage.getItem(activeCategory))
  );

  storedUrl.push([titleInput, urlInput]);

  createUrlList(storedUrl, urlListEl);

  localStorage.setItem(
    activeCategory,
    JSON.stringify(Object.fromEntries(storedUrl))
  );

  urltitleInputEl.value = "";
  urlInputEl.value = "";
});

// URL category - Get the active tab info
fetchTabBtn.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    urltitleInputEl.value = tabs[0].title;
    urlInputEl.value = tabs[0].url;
  });
});

// Back to category list
backBtn.addEventListener("click", () => {
  categoryListEl.style.display = "block";
  urlSection.style.display = "none";
  backBtn.style.display = "none";
  categorySection.style.display = "block";
  categoryHeading.style.display = "block";
  categoryHeading.textContent = "Category";
});

initializeApp();
