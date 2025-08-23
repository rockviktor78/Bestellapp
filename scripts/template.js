function generateDishHTML(dish) {
  return `
        <div class="dish">
            <img src="${dish.image}" alt="${dish.name}" class="dish-img">
            <h2 class="h2-dish">${dish.name}</h2>
            <p>${dish.description}</p>
            <div class="dish-footer">
                <span class="price">${dish.price.toFixed(2)} €</span>
                <button class="dish-button" onclick="addToBasket('${
                  dish.name
                }')">In den Warenkorb</button>
            </div>
        </div>
    `;
}

function xy(basketContainer, dishName, count, price) {
  // Wenn die Tabelle noch nicht existiert, erstelle sie mit einem eindeutigen tbody-ID
  if (!document.getElementById("basketTbody")) {
    basketContainer.innerHTML = `
      <table class="basket-table">              
        <thead>
          <tr>
            <th class="basket-col-name">Gericht</th>
          </tr>
        </thead>
        <tbody id="basketTbody"></tbody>
      </table>
    `;
  }
  const tbody = document.getElementById("basketTbody");
  tbody.innerHTML += `
    <tr class="basket-dish-row">
      <td class="basket-col-name">
        <div class="basket-dish-name">${dishName}</div>
        <div class="basket-dish-btn-group">
          <button onclick="removeFromBasket('${dishName}')">-</button>
          <span>${count}</span>
          <button onclick="addToBasket('${dishName}')">+</button>
          <button class="remove-all-btn" onclick="removeAllFromBasket('${dishName}')">🗑️</button>
        </div>
      </td>
      <td class="basket-col-price">${price.toFixed(2)} €</td>
    </tr>
  `;
}

/* script-mobile-menu*/
function slideIn() {
  document.getElementById("slide").classList.add("show-overlay-menu");
}
function closeMenu() {
  document.getElementById("slide").classList.remove("show-overlay-menu");
}

