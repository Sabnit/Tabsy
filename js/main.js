import { createCategoryListEl, createTabsList } from "./utils.js";

// Input fields
const inputCategoryEl = document.getElementById("category");

// Buttons
const saveCategoryBtn = document.getElementById("add-category");

// ul elements
const categoryUlEl = document.getElementById("ul-category");
const categoryItemsUlEl = document.getElementById("ul-category-items");

// div element
const categoryInputContainer = document.getElementById("category-input-field");
const categoryItemsContainer = document.getElementById(
  "category-items-container"
);

const backEl = document.getElementById("back-el");

// Initialize the lists
let categoryList = [];

function main() {
  categoryList = JSON.parse(localStorage.getItem("categoryList")) || [];

  createCategoryListEl(categoryList, categoryUlEl);

  let categoryItems = document.querySelectorAll("#ul-category li");

  categoryItems.forEach((item) => {
    item.addEventListener("click", () => {
      categoryItems.forEach((el) => {
        el.style.display = "none";
      });
      item.style.display = "block";
      getCategoryItems(item.textContent);
      backEl.style.display = "block";
    });
  });
}

function getCategoryItems(categoryName) {
  let items = Object.entries(JSON.parse(localStorage.getItem(categoryName)));

  createTabsList(items, categoryItemsUlEl);
  categoryItemsContainer.style.display = "block";
  categoryInputContainer.style.display = "none";
}

// Category Section
saveCategoryBtn.addEventListener("click", () => {
  let categoryName = inputCategoryEl.value;

  // Validation
  if (!categoryName) {
    console.log("Category is empty");
    return;
  }

  categoryList.push(categoryName);

  createCategoryListEl(categoryList, categoryUlEl);

  localStorage.setItem("categoryList", JSON.stringify(categoryList));
  localStorage.setItem(categoryName, "{}");

  inputCategoryEl.value = "";

  main();
});

backEl.addEventListener("click", () => {
  main();
  categoryItemsContainer.style.display = "none";
  backEl.style.display = "none";
  categoryInputContainer.style.display = "block";
});

main();
