function init() {
  const contentContainer = document.querySelector("#dishList");
  let html = "";

  myDishes.forEach((dish) => {
    html += generateDishHTML(dish);
  });

  contentContainer.innerHTML = html;
}

function addToBasket(dishName) {
  const notification = document.getElementById("addToBasketNotification");
  notification.textContent = `${dishName} wurde dem Warenkorb hinzugefügt!`;
  notification.classList.add("show");
  setTimeout(() => {
    notification.classList.remove("show");
  }, 1800);
}
