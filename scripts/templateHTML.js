// --- Ausgelagerte HTML-Templates ---

function getSuccessPopupHTML() {
  return `
		<div class="success-popup_content success-popup_content--success">
			<span class="success-popup_icon">✅</span>
			<p class="success-popup_text">Nachricht erfolgreich gesendet!</p>
		</div>
	`;
}

function getErrorPopupHTML(message) {
  return `
		<div class="success-popup_content success-popup_content--error">
			<span class="success-popup_icon">❌</span>
			<p class="success-popup_text">${message}</p>
		</div>
	`;
}

function getFABContent() {
  return `
		🛒
		<span class="mobile-cart-fab_count" id="mobileCartFABCount">0</span>
	`;
}

function getCartItemHTML(item) {
  return `
		<div class="cart-item">
			<div class="cart-item_info">
				<div class="cart-item_name">${item.name}</div>
				<div class="cart-item_price-info">
					<div class="cart-item_single-price">${item.price.toFixed(2)} € × ${
    item.quantity
  }</div>
					<div class="cart-item_total-price">${(item.price * item.quantity).toFixed(
            2
          )} €</div>
				</div>
			</div>
			<div class="cart-item_controls">
				<button class="cart-item_btn cart-item_btn--decrease" data-item="${
          item.name
        }" data-action="decrease">−</button>
				<span class="cart-item_quantity">${item.quantity}</span>
				<button class="cart-item_btn cart-item_btn--increase" data-item="${
          item.name
        }" data-action="increase">+</button>
				<button class="cart-item_btn cart-item_btn--delete" data-item="${
          item.name
        }" data-action="delete" title="Gericht entfernen">×</button>
			</div>
		</div>
	`;
}

function getAddToCartMessageHTML(itemName) {
  return `
		<span class="add-to-cart-message__icon">✓</span>
		<span class="add-to-cart-message__text">${itemName} hinzugefügt</span>
	`;
}

function getCheckoutPopupHTML(message, type) {
  return `
		<div class="checkout-popup_content checkout-popup_content--${type}">
			<span class="checkout-popup_icon">${type === "success" ? "✅" : "❌"}</span>
			<p class="checkout-popup_text">${message}</p>
		</div>
	`;
}

function getDeliveryInfoHTML(cart) {
  let orderValue = window.cartCore ? window.cartCore.getCartTotal() : 0;
  let deliveryCost = orderValue < 25 && orderValue > 0 ? 5 : 0;

  return `
    <span>Lieferkosten:</span> ${
      deliveryCost === 0 ? "kostenlos" : deliveryCost.toFixed(2) + " €"
    }<br>
    <span>Mindestbestellwert:</span> 10 €<br>
    <strong>Ab 25 € liefern wir kostenlos.</strong><br>
    <em>Abholung ist immer kostenfrei.</em>
  `;
}

function getFallbackDeliveryHTML(cart) {
  let orderValue = window.cartCore ? window.cartCore.getCartTotal() : 0;
  let deliveryCost = orderValue < 25 && orderValue > 0 ? 5 : 0;

  return (
    `<span>Lieferkosten:</span> ${
      deliveryCost === 0 ? "kostenlos" : deliveryCost.toFixed(2) + " €"
    }<br>` +
    `<span>Mindestbestellwert:</span> 10 €<br><strong>Ab 25 € liefern wir kostenlos.</strong><br>` +
    `<em>Abholung ist immer kostenfrei.</em>`
  );
}

// Window-Export für Kompatibilität mit bestehenden Modulen
window.templateHTML = {
  getSuccessPopupHTML,
  getErrorPopupHTML,
  getFABContent,
  getCartItemHTML,
  getAddToCartMessageHTML,
  getCheckoutPopupHTML,
  getDeliveryInfoHTML,
  getFallbackDeliveryHTML,
};
