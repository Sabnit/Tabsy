// Create category lists
export function createCategoryListEl(items, ulEl) {
  ulEl.innerHTML = "";
  for (let i = 0; i < items.length; i++) {
    let li = document.createElement("li");
    li.textContent = items[i];
    li.classList.add("categoryList");
    ulEl.appendChild(li);
  }
}

// Create tabs lists
export function createTabsList(items, ulEl) {
  ulEl.innerHTML = "";
  for (let i = 0; i < items.length; i++) {
    console.log(items[i][0]);
    console.log(items[i][1]);

    let li = document.createElement("li");
    let a = document.createElement("a");

    a.href = items[i][1];
    a.textContent = items[i][0];
    a.target = "_blank";

    a.classList.add("tabList");

    li.appendChild(a);
    ulEl.appendChild(li);
  }

  console.log(ulEl);
}
