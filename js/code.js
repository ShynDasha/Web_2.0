document.addEventListener("DOMContentLoaded", () => {
    // Додавання початкових товарів
    const initialItems = [
        { name: 'Помідори', quantity: 2, bought: false },
        { name: 'Печиво', quantity: 2, bought: false },
        { name: 'Сир', quantity: 1, bought: false }
    ];

    initialItems.forEach(item => addItemToDOM(item.name, item.quantity, item.bought));
    updateStatistics();
});

function addItem() {
    const newItemInput = document.getElementById("new-item");
    const itemName = newItemInput.value.trim();

    if (itemName) {
        addItemToDOM(itemName, 1, false);
        newItemInput.value = "";
        newItemInput.focus();
        updateStatistics();
    }
}

function addItemToDOM(name, quantity, bought) {
    const itemList = document.getElementById("item-list");
    const itemDiv = document.createElement("div");
    itemDiv.className = "item";
    
    const itemNameSpan = document.createElement("span");
    itemNameSpan.className = `item-name ${bought ? 'crossed-out' : ''}`;
    itemNameSpan.textContent = name;
    itemNameSpan.onclick = () => editItemName(itemNameSpan);

    const quantitySection = document.createElement("div");
    quantitySection.className = "quantity-section";

    const minusButton = document.createElement("button");
    minusButton.className = `quantity-button minus ${quantity <= 1 ? 'disabled' : ''}`;
    minusButton.textContent = "-";
    minusButton.onclick = () => changeQuantity(itemNameSpan, -1);

    const counterSpan = document.createElement("span");
    counterSpan.className = "counter";
    counterSpan.textContent = quantity;

    const plusButton = document.createElement("button");
    plusButton.className = "quantity-button plus";
    plusButton.textContent = "+";
    plusButton.onclick = () => changeQuantity(itemNameSpan, 1);

    quantitySection.appendChild(minusButton);
    quantitySection.appendChild(counterSpan);
    quantitySection.appendChild(plusButton);

    const statusButtonSection = document.createElement("div");
    statusButtonSection.className = "status-button-section";

    const statusButton = document.createElement("button");
    statusButton.className = `status-button ${bought ? 'not-bought' : 'bought'}`;
    statusButton.textContent = bought ? "Не куплено" : "Куплено";
    statusButton.onclick = () => toggleBought(itemDiv);

    statusButtonSection.appendChild(statusButton);

    const removeButton = document.createElement("button");
    removeButton.className = "remove-button";
    removeButton.textContent = "✖";
    removeButton.onclick = () => removeItem(itemDiv);
    if (bought) {
        removeButton.style.display = 'none';
        minusButton.style.display = 'none';
        plusButton.style.display = 'none';
    }

    statusButtonSection.appendChild(removeButton);

    itemDiv.appendChild(itemNameSpan);
    itemDiv.appendChild(quantitySection);
    itemDiv.appendChild(statusButtonSection);

    itemList.appendChild(itemDiv);
}

function editItemName(itemNameSpan) {
    const originalName = itemNameSpan.textContent;
    const input = document.createElement("input");
    input.type = "text";
    input.value = originalName;
    input.onblur = () => {
        itemNameSpan.textContent = input.value.trim() || originalName;
        itemNameSpan.parentNode.replaceChild(itemNameSpan, input);
        updateStatistics();
    };
    itemNameSpan.parentNode.replaceChild(input, itemNameSpan);
    input.focus();
}

function changeQuantity(itemNameSpan, delta) {
    const counterSpan = itemNameSpan.nextSibling.querySelector(".counter");
    let newQuantity = parseInt(counterSpan.textContent) + delta;
    newQuantity = Math.max(1, newQuantity);
    counterSpan.textContent = newQuantity;

    const minusButton = counterSpan.previousSibling;
    minusButton.classList.toggle("disabled", newQuantity <= 1);
    updateStatistics();
}

function toggleBought(itemDiv) {
    const itemNameSpan = itemDiv.querySelector('.item-name');
    const boughtButton = itemDiv.querySelector('.status-button');
    const deleteButton = itemDiv.querySelector('.remove-button');
    const minusButton = itemDiv.querySelector('.quantity-button.minus');
    const plusButton = itemDiv.querySelector('.quantity-button.plus');

    itemNameSpan.classList.toggle('crossed-out');
    if (itemNameSpan.classList.contains('crossed-out')) {
        boughtButton.textContent = 'Не куплено';
        boughtButton.className = 'status-button not-bought';
        deleteButton.style.display = 'none';
        minusButton.style.visibility = 'hidden';
        plusButton.style.visibility = 'hidden';
    } else {
        boughtButton.textContent = 'Куплено';
        boughtButton.className = 'status-button bought';
        deleteButton.style.display = 'inline-block';
        minusButton.style.visibility = 'visible';
        plusButton.style.visibility = 'visible';
    }
    updateStatistics();
}


function removeItem(itemDiv) {
    itemDiv.remove();
    updateStatistics();
}

function updateStatistics() {
    const remainingItems = document.getElementById("remaining-items");
    const boughtItems = document.getElementById("bought-items");

    remainingItems.innerHTML = "";
    boughtItems.innerHTML = "";

    document.querySelectorAll(".item").forEach(item => {
        const name = item.querySelector(".item-name").textContent;
        const quantity = parseInt(item.querySelector(".counter")?.textContent || 0);
        const isBought = item.querySelector(".item-name").classList.contains("crossed-out");

        const productButton = document.createElement("button");
        productButton.className = "bough";
        productButton.innerHTML = `<strong>${name}</strong><span class="circle">${quantity}</span>`;

        if (isBought) {
            boughtItems.appendChild(productButton);
        } else {
            remainingItems.appendChild(productButton);
        }
    });
}
