import {
  createCategoryListEl,
  createUrlList,
  checkValidUrl,
  addUrlToLocalStorage,
  handleEditUrl,
  findUrlIndex,
  retreiveURLsFromLocalStorage,
} from "./utils.js";

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

// Get the categories list from the localStorage
let categoryList = JSON.parse(localStorage.getItem("categoryList")) || [];

// Flag to track if url is being edited
let editUrlFlag = false;

// Category Section
// Display categories list
function initializeApp() {
  createCategoryListEl(categoryList, categoryListEl);
}

// Add new category
// With enter key
categoryInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    createNewCategory();
  }
});

// With Add Category button
addCategoryBtn.addEventListener("click", createNewCategory);

// Display category URLs list
categoryListEl.addEventListener("click", (event) => {
  if (event.target.tagName === "LI") {
    let clickedCategory = event.target.textContent.trim().split("\n")[0];
    let storedUrl = retreiveURLsFromLocalStorage(clickedCategory);

    categoryListEl.style.display = "none";
    backBtn.style.display = "block";

    categoryHeading.innerHTML = `
    ${clickedCategory}
    <button class="edit-btn"> Edit</button>
    <button class="delete-btn"> Delete</button>
    `;

    categoryHeading.querySelector(".edit-btn").addEventListener("click", () => {
      console.log("edit btn clicked");
    });

    categoryHeading
      .querySelector(".delete-btn")
      .addEventListener("click", () => {
        if (storedUrl.length == 0) {
          const findCategoryIndex = categoryList.findIndex(
            (item) => item == clickedCategory
          );

          categoryList.splice(findCategoryIndex, 1);
          localStorage.removeItem(clickedCategory);
          localStorage.removeItem("categoryList");
          localStorage.setItem("categoryList", JSON.stringify(categoryList));

          createCategoryListEl(categoryList, categoryListEl);
          renderCategoryList();
        } else {
          console.log("Error: list is not empty");
        }
      });
    displayCategoryUrls(clickedCategory, urlListEl);
  }
});

// URL Section
// Add new url
saveUrlBtn.addEventListener("click", () => {
  let titleInput = urltitleInputEl.value;
  let urlInput = urlInputEl.value;
  let activeCategory = categoryHeading.textContent.trim().split("\n")[0];
  let storedUrl = retreiveURLsFromLocalStorage(activeCategory);

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

  urltitleInputEl.value = "";
  urlInputEl.value = "";

  storedUrl.push([titleInput, urlInput]);
  createUrlList(storedUrl, urlListEl);

  addUrlToLocalStorage(activeCategory, storedUrl);
});

// Get the active tab info
fetchTabBtn.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    urltitleInputEl.value = tabs[0].title;
    urlInputEl.value = tabs[0].url;
  });
});

// Handle edit and delete functionality of URLs
urlListEl.addEventListener("click", (event) => {
  // Identify the clicked URL and its category
  let clickedUrl = event.target.closest("li");
  let activeCategory = categoryHeading.textContent.trim().split("\n")[0];
  let selectedUrl = clickedUrl.textContent.trim().split("\n")[0];

  // Retreive stored URLS for the active category from localStorage
  let storedUrl = retreiveURLsFromLocalStorage(activeCategory);
  console.log(storedUrl);

  // Handle URL editing (Ensures only one URL can be edited at a time)
  if (event.target.classList.contains("edit-url-btn")) {
    let urlIndex = findUrlIndex(storedUrl, selectedUrl);

    // Prevent multiple edits at the same time
    if (editUrlFlag) {
      console.log("Error: An url is using edit function");
      return;
    }
    editUrlFlag = true;

    handleEditUrl(clickedUrl);

    const urlTitle = clickedUrl.querySelector("#edit-url-title");
    const url = clickedUrl.querySelector("#edit-url");
    const saveEditedUrlBtn = clickedUrl.querySelector("#save-updated-url-btn");
    const cancelEditedUrlBtn = clickedUrl.querySelector("#cancel-update-url");

    // Populate input fields with existing URL details
    urlTitle.value = storedUrl[urlIndex][0];
    url.value = storedUrl[urlIndex][1];

    // Save the updated URL details
    saveEditedUrlBtn.addEventListener("click", () => {
      editUrlFlag = false; //Reset flag after saving
      storedUrl[urlIndex] = [urlTitle.value, url.value];
      localStorage.removeItem(activeCategory);
      addUrlToLocalStorage(activeCategory, storedUrl);
      displayCategoryUrls(activeCategory, urlListEl);
    });

    // Cancel changing the url details
    cancelEditedUrlBtn.addEventListener("click", () => {
      editUrlFlag = false; //Reset flag after saving
      displayCategoryUrls(activeCategory, urlListEl);
    });
  }

  // Handle removing of URL
  if (event.target.classList.contains("delete-url-btn")) {
    let urlIndex = findUrlIndex(storedUrl, selectedUrl);
    storedUrl.splice(urlIndex, 1);
    localStorage.removeItem(activeCategory);
    addUrlToLocalStorage(activeCategory, storedUrl);
    displayCategoryUrls(activeCategory, urlListEl);
  }
});

// Return back to Categories
backBtn.addEventListener("click", renderCategoryList);

// Helper functions
// Render Categories
function renderCategoryList() {
  categoryListEl.style.display = "block";
  urlSection.style.display = "none";
  backBtn.style.display = "none";
  categorySection.style.display = "block";
  categoryHeading.style.display = "block";
  categoryHeading.textContent = "Category";
}

// Create new Category
function createNewCategory() {
  let newCategory = categoryInput.value;
  // Validation
  if (!newCategory) {
    console.log("Error: Category is empty");
    return;
  }
  // validation
  if (categoryList.includes(newCategory)) {
    console.log("Error: Same category exists");
    return;
  }
  categoryList.push(newCategory);
  localStorage.setItem("categoryList", JSON.stringify(categoryList));
  localStorage.setItem(newCategory, "{}"); // Store an empty object to prevent error
  createCategoryListEl(categoryList, categoryListEl);
  categoryInput.value = "";
  categoryInput.focus();
}

// Render URLS
function displayCategoryUrls(categoryName, ulEl) {
  let storedUrl = retreiveURLsFromLocalStorage(categoryName);

  createUrlList(storedUrl, ulEl);
  urlSection.style.display = "block";
  categorySection.style.display = "none";
}

initializeApp();
