let basket = {};

/**
 * Initialisiert die Anwendung und lädt alle Gerichte
 * Versteckt die Danksagungsnachricht beim Start
 */
async function init() {
  await includeHTML();

  // Nur auf der Hauptseite mit Gerichten ausführen
  const contentContainer = document.getElementById("dishList");
  if (contentContainer) {
    let html = "";
    myDishes.forEach((dish) => {
      html += generateDishHTML(dish);
    });
    contentContainer.innerHTML = html;
    renderBasket();
    hideThankYouMessage();
  }
}

/**
 * Versteckt die Danksagungsnachricht nach der Bestellung
 */
function hideThankYouMessage() {
  const thankYouElement = document.getElementById("SayThankYou");
  thankYouElement.classList.add("hidden");
}

/**
 * Fügt ein Gericht zum Warenkorb hinzu oder erhöht die Anzahl
 * @param {string} dishName - Name des Gerichts
 */
function addToBasket(dishName) {
  if (!basket[dishName]) {
    basket[dishName] = 1;
  } else {
    basket[dishName]++;
  }
  showNotification(dishName + " wurde dem Warenkorb hinzugefügt!");
  showOrderButton();
  hideThankYouMessage();
  renderBasket();
}

/**
 * Entfernt ein einzelnes Gericht aus dem Warenkorb
 * @param {string} dishName - Name des Gerichts
 */
function removeFromBasket(dishName) {
  if (basket[dishName]) {
    basket[dishName]--;
    if (basket[dishName] <= 0) {
      delete basket[dishName];
    }
    renderBasket();
  }
}

/**
 * Entfernt alle Exemplare eines Gerichts aus dem Warenkorb
 * @param {string} dishName - Name des Gerichts
 */
function removeAllFromBasket(dishName) {
  if (basket[dishName]) {
    delete basket[dishName];
    renderBasket();
  }
}

/**
 * Zeigt eine Benachrichtigung für kurze Zeit an
 * @param {string} text - Text der Benachrichtigung
 * @param {number} duration - Anzeigedauer in Millisekunden (optional)
 */
function showNotification(text, duration = 1800) {
  const notification = document.getElementById("addToBasketNotification");
  notification.textContent = text;
  notification.classList.add("show");
  setTimeout(() => {
    notification.classList.remove("show");
  }, duration);
}

/**
 * Berechnet die Gesamtsumme aller Artikel im Warenkorb
 * @returns {number} Gesamtpreis
 */
function calculateTotal() {
  let total = 0;
  for (const dishName in basket) {
    const dish = myDishes.find((d) => d.name === dishName);
    const count = basket[dishName];
    const price = dish.price * count;
    total += price;
  }
  return total;
}

/**
 * Rendert den Warenkorb und aktualisiert die Anzeige
 */
function renderBasket() {
  const basketContainer = document.getElementById("basketDishes");
  const totalSpan = document.getElementById("basketTotal");
  basketContainer.innerHTML = "";

  for (const dishName in basket) {
    const dish = myDishes.find((d) => d.name === dishName);
    const count = basket[dishName];
    const price = dish.price * count;
    xy(basketContainer, dishName, count, price);
  }

  const total = calculateTotal();
  totalSpan.textContent = total.toFixed(2) + " €";
}

/**
 * Leert den kompletten Warenkorb und setzt die Anzeige zurück
 */
function clearBasket() {
  basket = {};
  document.getElementById("basketTotal").textContent = "0.00 €";
  renderBasket();
}

/**
 * Zeigt die Danksagungsnachricht nach der Bestellung an
 */
function showThankYouMessage() {
  const thankYouElement = document.getElementById("SayThankYou");
  thankYouElement.classList.remove("hidden");
}

/**
 * Verarbeitet die Bestellung und leert den Warenkorb
 * Zeigt Bestätigung und Danksagung an
 */
function orderBasket() {
  if (Object.keys(basket).length === 0) {
    showNotification("Ihr Warenkorb ist leer!");
    return;
  }
  showNotification("Bestellung wurde aufgegeben!", 3600);
  clearBasket();
  hideOrderButton();
  setTimeout(() => {
    showThankYouMessage();
  }, 500);
}

/**
 * Versteckt den Bestell-Button nach der Bestellung
 */
function hideOrderButton() {
  const orderButton = document.getElementById("orderButton");
  orderButton.style.display = "none";
}

/**
 * Zeigt den Bestell-Button wieder an
 */
function showOrderButton() {
  const orderButton = document.getElementById("orderButton");
  orderButton.style.display = "block";
}
