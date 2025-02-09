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
