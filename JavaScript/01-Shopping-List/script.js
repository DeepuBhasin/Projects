/* bad way to use event listener because we are adding same event listener multiple times
let deleteElement = document.querySelectorAll("#grocery-list .delete");
deleteElement.forEach((element) => {
    element.addEventListener("click", (e) => {
        e.target.parentElement.remove();
    });
});
*/

// good way to use event listener because we are not adding same event listener multiple times
let groceryUl = document.querySelector("#grocery-list ul");
groceryUl.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete")) {
        e.target.parentElement.remove();
    }
});



let formElement = document.forms["add-item"];
formElement.addEventListener("submit", (e) => {
    e.preventDefault();

    let inputValue = formElement.querySelector('input[type="text"]').value;
    if (inputValue === "") {
        return;
    }

    let ulElement = document.getElementsByTagName("ul")[0];

    const liElement = document.createElement("li");
    const itemElement = document.createElement("span");
    const deleteElement = document.createElement("button");

    itemElement.textContent = inputValue;
    itemElement.classList.add("item");

    deleteElement.textContent = "Delete";
    deleteElement.classList.add("delete");

    liElement.appendChild(itemElement);
    liElement.appendChild(deleteElement);
    ulElement.appendChild(liElement);
});


// Hide items
let hideCheckbox = document.querySelector("#hide");
hideCheckbox.addEventListener("change", (e) => {
    let item = document.querySelector("#grocery-list");
    if (e.target.checked) {
        item.style.display = "none";
    } else {
        item.style.display = "block";
    }
});

// Search Items
let searchElement = document.querySelector("#search input");
searchElement.addEventListener("keyup", (e) => {
    let term = e.target.value.toLowerCase();
    let groceries = document.querySelectorAll(".item");
    groceries.forEach((grocery) => {
        let groceryText = grocery.textContent;
        if (groceryText.toLowerCase().indexOf(term) != -1) {
            grocery.parentElement.style.display = "block";
        } else {
            grocery.parentElement.style.display = "none";
        }
    });
})