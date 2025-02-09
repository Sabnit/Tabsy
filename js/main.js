import { createCategoryListEl, createTabsList } from "./utils.js";

// Input fields
const categoryInput = document.getElementById("category");

// Buttons
const addCategoryBtn = document.getElementById("add-category-btn");

// ul elements`
const categoryListEl = document.getElementById("category-list");
const urlListEl = document.getElementById("url-list");

// div element
const categorySection = document.getElementById("category-section");
const urlSection = document.getElementById("url-section");

const backBtn = document.getElementById("back-btn");

// Initialize the lists
let categoryList = JSON.parse(localStorage.getItem("categoryList")) || [];

function initializeApp() {
  createCategoryListEl(categoryList, categoryListEl);
}

// ✅ Attach a single event listener to the parent `ul`
categoryListEl.addEventListener("click", (event) => {
  if (event.target.tagName === "LI") {
    let categoryName = event.target.textContent;

    categoryListEl.style.display = "none";
    backBtn.style.display = "block";
    displayCategoryUrls(categoryName, urlListEl);
  }
});

function displayCategoryUrls(categoryName, ulEl) {
  let storedItems = Object.entries(
    JSON.parse(localStorage.getItem(categoryName))
  );

  createTabsList(storedItems, ulEl);
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

// Back to category list
backBtn.addEventListener("click", () => {
  categoryListEl.style.display = "block";
  urlSection.style.display = "none";
  backBtn.style.display = "none";
  categorySection.style.display = "block";
});

initializeApp();
