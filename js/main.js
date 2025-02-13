import {
  createCategoryListEl,
  createUrlList,
  checkValidUrl,
  addUrlToLocalStorage,
  createEditUrlFields,
  findUrlIndex,
  retreiveURLsFromLocalStorage,
  findCategoryIndex,
  extractFirstLine,
  isUniqueUrlTitle,
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
let isEditingUrl = false;

/**
 * Initialize the app
 */
function initializeApp() {
  createCategoryListEl(categoryList, categoryListEl);
}

/**
 * Handles displaying URLs of a selected Category
 */
function displayCategoryUrls(categoryName) {
  categoryListEl.style.display = "none";
  backBtn.style.display = "block";

  categoryHeading.innerHTML = `
    ${categoryName}
    <button class="edit-btn"> Edit</button>
    <button class="delete-btn"> Delete</button>
    `;

  categoryHeading.querySelector(".edit-btn").addEventListener("click", () => {
    console.log("edit btn clicked");
  });

  categoryHeading
    .querySelector(".delete-btn")
    .addEventListener("click", () => deleteCategory(categoryName));
  renderCategoryUrls(categoryName, urlListEl);
}

/**
 * Handles deleting a category
 */
function deleteCategory(categoryName) {
  let storedUrls = retreiveURLsFromLocalStorage(categoryName);

  if (storedUrls.length == 0) {
    const categoryIndex = findCategoryIndex(categoryList, categoryName);

    categoryList.splice(categoryIndex, 1);
    localStorage.removeItem(categoryName);
    localStorage.removeItem("categoryList");
    localStorage.setItem("categoryList", JSON.stringify(categoryList));

    createCategoryListEl(categoryList, categoryListEl);
    toggleCategoryView();
  } else {
    console.log("Error: list is not empty");
  }
}

/**
 * Handles adding a new URL
 */
function addNewUrl() {
  let titleInput = urltitleInputEl.value.trim();
  let urlInput = urlInputEl.value;
  let activeCategory = extractFirstLine(categoryHeading.textContent);
  let storedUrls = retreiveURLsFromLocalStorage(activeCategory);

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

  if (!isUniqueUrlTitle(storedUrls, titleInput)) return;

  urltitleInputEl.value = "";
  urlInputEl.value = "";

  storedUrls.push([titleInput, urlInput]);
  createUrlList(storedUrls, urlListEl);

  addUrlToLocalStorage(activeCategory, storedUrls);
}

/**
 * Handles fetching the active browser tab's URL
 */
function fetchActiveTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    urltitleInputEl.value = tabs[0].title;
    urlInputEl.value = tabs[0].url;
  });
}

/**
 * Handles editing and deleting URLs
 */
function handleUrlClick(event) {
  // Identify the clicked URL and its category
  let clickedUrl = event.target.closest("li");
  let selectedUrl = extractFirstLine(clickedUrl.textContent);
  let activeCategory = extractFirstLine(categoryHeading.textContent);

  // Retreive stored URLS for the active category from localStorage
  let storedUrls = retreiveURLsFromLocalStorage(activeCategory);

  // Retreive the index of the url
  let urlIndex = findUrlIndex(storedUrls, selectedUrl);

  // Handle URL editing (Ensures only one URL can be edited at a time)
  if (event.target.classList.contains("edit-url-btn")) {
    // Prevent multiple edits at the same time
    if (isEditingUrl) {
      console.log("Error: An url is using edit function");
      return;
    }
    isEditingUrl = true;

    // Generate input fields and action buttons (Save & Delete) for URL editing
    createEditUrlFields(clickedUrl);

    const urlTitleField = clickedUrl.querySelector("#edit-url-title");
    const urlField = clickedUrl.querySelector("#edit-url");
    const saveEditedUrlBtn = clickedUrl.querySelector("#save-updated-url-btn");
    const cancelEditedUrlBtn = clickedUrl.querySelector("#cancel-update-url");

    // Populate input fields with existing URL details
    urlTitleField.value = storedUrls[urlIndex][0];
    urlField.value = storedUrls[urlIndex][1];

    // Save the updated URL details
    saveEditedUrlBtn.addEventListener("click", () => {
      if (!isUniqueUrlTitle(storedUrls, urlTitleField.value)) return;
      isEditingUrl = false; //Reset flag after saving
      storedUrls[urlIndex] = [urlTitleField.value, urlField.value];
      addUrlToLocalStorage(activeCategory, storedUrls);
      renderCategoryUrls(activeCategory, urlListEl);
    });

    // Cancel changing the url details
    cancelEditedUrlBtn.addEventListener("click", () => {
      isEditingUrl = false; //Reset flag after saving
      renderCategoryUrls(activeCategory, urlListEl);
    });
  }

  // Handle removing URL
  if (event.target.classList.contains("delete-url-btn")) {
    if (isEditingUrl) {
      console.log("Error: url is being edited");
      return;
    }

    storedUrls.splice(urlIndex, 1);
    addUrlToLocalStorage(activeCategory, storedUrls);
    renderCategoryUrls(activeCategory, urlListEl);
    isEditingUrl = false;
  }
}

/**
 * Display the category list and hide other sections
 */
function toggleCategoryView() {
  isEditingUrl = false;
  categoryListEl.style.display = "block";
  urlSection.style.display = "none";
  backBtn.style.display = "none";
  categorySection.style.display = "block";
  categoryHeading.style.display = "block";
  categoryHeading.textContent = "Category";
}

/**
 * Handle adding a new category
 */
function createNewCategory() {
  let newCategory = categoryInput.value.trim();
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

/**
 * Render URLs of a specific category
 */
function renderCategoryUrls(categoryName, ulEl) {
  let storedUrls = retreiveURLsFromLocalStorage(categoryName);
  createUrlList(storedUrls, ulEl);
  urlSection.style.display = "block";
  categorySection.style.display = "none";
}

// Event Listeners
// Category - Event Listeners
addCategoryBtn.addEventListener("click", createNewCategory);
categoryListEl.addEventListener("click", (event) => {
  if (event.target.tagName === "LI") {
    displayCategoryUrls(extractFirstLine(event.target.textContent));
  }
});
categoryInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") createNewCategory();
});

// URL - Event Listeners
urlListEl.addEventListener("click", handleUrlClick);
fetchTabBtn.addEventListener("click", fetchActiveTab);
saveUrlBtn.addEventListener("click", addNewUrl);
backBtn.addEventListener("click", toggleCategoryView);

// Initialize App
initializeApp();
