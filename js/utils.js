// Create category lists
export function createCategoryListEl(items, ulEl) {
  ulEl.innerHTML = "";

  if (items.length === 0) return;

  for (let i = 0; i < items.length; i++) {
    let li = document.createElement("li");
    li.textContent = items[i];
    li.classList.add("categoryList");
    ulEl.appendChild(li);
  }
}

// Create tabs lists
export function createUrlList(items, ulEl) {
  ulEl.innerHTML = "";
  for (let i = 0; i < items.length; i++) {
    let li = document.createElement("li");
    let a = document.createElement("a");

    a.href = items[i][1];
    a.textContent = items[i][0];
    a.target = "_blank";
    a.classList.add("tabList");

    li.appendChild(a);
    li.innerHTML += `
      <button class="edit-url-btn"> Edit</button> 
      <button class="delete-url-btn"> Delete</button>`;

    ulEl.appendChild(li);
  }
}

// Check valid url address
export function checkValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
}

// Create input fields, edit and delete buttons when editing an url
export function createEditUrlFields(selectedUrl) {
  let urlTitleInput = document.createElement("input");
  let urlInput = document.createElement("input");
  let saveBtn = document.createElement("button");
  let cancelBtn = document.createElement("button");

  urlTitleInput.setAttribute("id", "edit-url-title");
  urlInput.setAttribute("id", "edit-url");
  saveBtn.setAttribute("id", "save-updated-url-btn");
  saveBtn.textContent = "Save";
  cancelBtn.setAttribute("id", "cancel-update-url");
  cancelBtn.textContent = "Cancel";

  selectedUrl.appendChild(urlTitleInput);
  selectedUrl.appendChild(urlInput);
  selectedUrl.appendChild(saveBtn);
  selectedUrl.appendChild(cancelBtn);
}

// Find the url index in the url list
export function findUrlIndex(urlList, url) {
  return urlList.findIndex((item) => item[0] == url);
}

export function findCategoryIndex(categoryList, categoryName) {
  return categoryList.findIndex((item) => item == categoryName);
}

// Retrieve stored URLS for the active category from localStorage
export function retreiveURLsFromLocalStorage(category) {
  return Object.entries(JSON.parse(localStorage.getItem(category)));
}

// Update the category's urls in localStorage
export function addUrlToLocalStorage(categoryName, urlArray) {
  localStorage.setItem(
    categoryName,
    JSON.stringify(Object.fromEntries(urlArray))
  );
}

// Extracts the first line from a given text after trimming whitespace
export function extractFirstLine(text) {
  return text.trim().split("\n")[0];
}

// Check unique url title from urls
export function isUniqueUrlTitle(urls, title) {
  for (let i = 0; i < urls.length; i++) {
    if (urls[i].includes(title)) {
      console.log("same url title exists");
      return false; // title exists
    }
  }
  return true; // title is unique
}
