function generateDishHTML(dish) {
    return `
        <div class="dish">
            <img src="${dish.image}" alt="${dish.name}" class="dish-img">
            <h2>${dish.name}</h2>
            <p>${dish.description}</p>
            <div class="dish-footer">
                <span class="price">${dish.price.toFixed(2)} €</span>
                <button onclick="addToBasket('${dish.name}')">In den Warenkorb</button>
            </div>
        </div>
    `;
}