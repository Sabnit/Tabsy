import { createCategoryListEl } from "./utils.js";

// Input fields
const inputCategoryEl = document.getElementById("category");

// Buttons
const saveCategoryBtn = document.getElementById("save-category");

// ul elements
const categoryUlEl = document.getElementById("ul-category");

// Initialize the lists
let categoryList = [];

function main() {
  categoryList = JSON.parse(localStorage.getItem("categoryList"));

  createCategoryListEl(categoryList, categoryUlEl);
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
});

main();
