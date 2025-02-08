// Create category lists
export function createCategoryListEl(items, ulEl) {
  ulEl.innerHTML = "";
  for (let i = 0; i < items.length; i++) {
    let li = document.createElement("li");
    let a = document.createElement("a");

    a.href = "#";
    a.textContent = items[i];
    a.classList.add("tabList");

    li.appendChild(a);
    ulEl.appendChild(li);
  }
}
