// Cart UI Management
let cartModal = null;

/**
 * Loads the cart modal from the template file
 */
let loadCartModal = async () => {
  let response = await fetch("templates/cart-modal.html");
  if (response.ok) {
    let html = await response.text();
    document.body.insertAdjacentHTML("beforeend", html);
    cartModal = document.getElementById("cartModal");
  }
};

/**
 * Creates FAB button element
 * @returns {HTMLElement} FAB button element
 */
let createFABElement = () => {
  let fab = document.createElement("button");
  fab.id = "mobileCartFAB";
  fab.className = "mobile-cart-fab";
  fab.style.display = "none";
  return fab;
};

/**
 * Sets FAB button content
 * @param {HTMLElement} fab - FAB element
 */
let setFABContent = (fab) => {
  if (window.templateHTML && window.templateHTML.getFABContent) {
    fab.innerHTML = window.templateHTML.getFABContent();
  }
};

/**
 * Adds event listener to FAB
 * @param {HTMLElement} fab - FAB element
 */
let addFABEventListener = (fab) => {
  fab.addEventListener("click", openCartModal);
};

/**
 * Creates the mobile cart FAB button
 * @returns {HTMLElement} The created FAB element
 */
let createMobileCartFAB = () => {
  let fab = createFABElement();
  setFABContent(fab);
  addFABEventListener(fab);
  return fab;
};

/**
 * Opens the cart modal
 */
let openCartModal = () => {
  if (cartModal) {
    cartModal.classList.add("cart-modal--open");
    document.body.style.overflow = "hidden";
    renderCartItems();
  }
};

/**
 * Closes the cart modal
 */
let closeCartModal = () => {
  if (cartModal) {
    cartModal.classList.remove("cart-modal--open");
    document.body.style.overflow = "";
  }
};

/**
 * Renders all items in the cart modal
 */
let renderCartItems = () => {
  let cart = getCartData();
  updateDeliveryInfo(cart);
  if (cart.length === 0) {
    showEmptyCartView();
  } else {
    showCartWithItems();
  }
};

/**
 * Gets cart data from cart core
 * @returns {Array} Cart items array
 */
let getCartData = () => {
  return window.cartCore ? window.cartCore.getCart() : [];
};

/**
 * Updates delivery information display
 * @param {Array} cart - Cart items array
 */
let updateDeliveryInfo = (cart) => {
  let deliveryInfo = getOrCreateDeliveryInfo();
  let deliveryContent = generateDeliveryContent(cart);
  setDeliveryInfoContent(deliveryInfo, deliveryContent);
};

/**
 * Gets or creates delivery info element
 * @returns {HTMLElement} Delivery info element
 */
let getOrCreateDeliveryInfo = () => {
  let deliveryInfo = document.getElementById("cartDeliveryInfo");
  if (!deliveryInfo) {
    deliveryInfo = createDeliveryInfoElement();
  }
  return deliveryInfo;
};

/**
 * Creates delivery info element
 * @returns {HTMLElement} New delivery info element
 */
let createDeliveryInfoElement = () => {
  let cartFooter = document.getElementById("cartModalFooter");
  let deliveryInfo = document.createElement("div");
  deliveryInfo.id = "cartDeliveryInfo";
  deliveryInfo.style.marginTop = "1em";
  cartFooter.appendChild(deliveryInfo);
  return deliveryInfo;
};

/**
 * Generates delivery content based on cart
 * @param {Array} cart - Cart items array
 * @returns {string} HTML content for delivery info
 */
let generateDeliveryContent = (cart) => {
  if (window.templateHTML && window.templateHTML.getDeliveryInfoHTML) {
    return window.templateHTML.getDeliveryInfoHTML(cart);
  }
  return getFallbackDeliveryHTML(cart);
};

/**
 * Gets fallback delivery HTML
 * @param {Array} cart - Cart items array
 * @returns {string} Fallback HTML content
 */
let getFallbackDeliveryHTML = (cart) => {
  if (window.templateHTML && window.templateHTML.getFallbackDeliveryHTML) {
    return window.templateHTML.getFallbackDeliveryHTML(cart);
  }
  return "Lieferinformationen nicht verfügbar.";
};

/**
 * Sets content for delivery info element
 * @param {HTMLElement} deliveryInfo - Delivery info element
 * @param {string} content - HTML content to set
 */
let setDeliveryInfoContent = (deliveryInfo, content) => {
  deliveryInfo.innerHTML = content;
};

/**
 * Shows empty cart view
 */
let showEmptyCartView = () => {
  let cartEmpty = document.getElementById("cartEmpty");
  let cartItems = document.getElementById("cartItems");
  let cartFooter = document.getElementById("cartModalFooter");
  cartEmpty.style.display = "block";
  cartItems.innerHTML = "";
  cartFooter.style.display = "block";
  updateCartTotal();
};

/**
 * Shows cart view with items
 */
let showCartWithItems = () => {
  let cartEmpty = document.getElementById("cartEmpty");
  let cartItems = document.getElementById("cartItems");
  let cartFooter = document.getElementById("cartModalFooter");
  cartEmpty.style.display = "none";
  cartFooter.style.display = "block";
  cartItems.innerHTML = generateCartItemsHTML();
  updateCartTotal();
  initCartItemEventListeners();
};

/**
 * Generates HTML for cart items
 * @returns {string} HTML string for all cart items
 */
let generateCartItemsHTML = () => {
  let cart = window.cartCore ? window.cartCore.getCart() : [];
  return generateItemsHTML(cart);
};

/**
 * Generates HTML for cart items using templates
 * @param {Array} cart - Cart items array
 * @returns {string} HTML string for all cart items
 */
let generateItemsHTML = (cart) => {
  if (window.templateHTML && window.templateHTML.getCartItemHTML) {
    return mapItemsToHTML(cart);
  } else {
    console.warn("templateHTML.getCartItemHTML not available!");
    return "";
  }
};

/**
 * Maps cart items to HTML using template
 * @param {Array} cart - Cart items array
 * @returns {string} Joined HTML string
 */
let mapItemsToHTML = (cart) => {
  return cart.map((item) => window.templateHTML.getCartItemHTML(item)).join("");
};

/**
 * Initializes event listeners for cart item buttons
 */
let initCartItemEventListeners = () => {
  let cartItems = document.getElementById("cartItems");
  if (cartItems) {
    cartItems.removeEventListener("click", handleCartItemClick);
    cartItems.addEventListener("click", handleCartItemClick);
  }
};

/**
 * Handles clicks on cart item buttons
 * @param {Event} e - The click event
 */
let handleCartItemClick = (e) => {
  if (!isCartItemButton(e.target)) return;
  let actionData = getActionData(e.target);
  if (!actionData.isValid) return;
  executeCartAction(actionData.action, actionData.itemName);
};

/**
 * Checks if clicked element is a cart item button
 * @param {HTMLElement} target - The clicked element
 * @returns {boolean} True if it is a cart item button
 */
let isCartItemButton = (target) => {
  return target.classList.contains("cart-item_btn");
};

/**
 * Gets action data from button element
 * @param {HTMLElement} button - The button element
 * @returns {Object} Action data with isValid, action, and itemName
 */
let getActionData = (button) => {
  let itemName = button.getAttribute("data-item");
  let action = button.getAttribute("data-action");
  return {
    isValid: !!(itemName && action),
    action: action,
    itemName: itemName,
  };
};

/**
 * Executes cart action based on action type
 * @param {string} action - The action to execute
 * @param {string} itemName - The item name
 */
let executeCartAction = (action, itemName) => {
  switch (action) {
    case "increase":
      executeIncreaseAction(itemName);
      break;
    case "decrease":
      executeDecreaseAction(itemName);
      break;
    case "delete":
      executeDeleteAction(itemName);
      break;
  }
};

/**
 * Executes increase quantity action
 * @param {string} itemName - The item name
 */
let executeIncreaseAction = (itemName) => {
  if (window.cartCore && window.cartCore.increaseQuantity) {
    window.cartCore.increaseQuantity(itemName);
  }
};

/**
 * Executes decrease quantity action
 * @param {string} itemName - The item name
 */
let executeDecreaseAction = (itemName) => {
  if (window.cartCore && window.cartCore.decreaseQuantity) {
    window.cartCore.decreaseQuantity(itemName);
  }
};

/**
 * Executes delete item action
 * @param {string} itemName - The item name
 */
let executeDeleteAction = (itemName) => {
  if (window.cartCore && window.cartCore.removeItemFromCart) {
    window.cartCore.removeItemFromCart(itemName);
  }
};

/**
 * Updates the total sum in the cart
 */
let updateCartTotal = () => {
  let totalElement = document.getElementById("cartTotalAmount");
  if (totalElement && window.cartCore) {
    let orderValue = window.cartCore.getCartTotal();
    let deliveryCost = orderValue < 25 && orderValue > 0 ? 5 : 0;
    let totalWithDelivery = orderValue + deliveryCost;
    totalElement.textContent = `${totalWithDelivery.toFixed(2)} €`;
  } else if (totalElement) {
    totalElement.textContent = "0,00 €";
  }
};

/**
 * Shows the mobile cart FAB button on mobile devices
 */
let showMobileCartFAB = () => {
  let fab = document.getElementById("mobileCartFAB");
  if (fab) {
    if (window.innerWidth <= 820) {
      fab.style.display = "flex";
    } else {
      fab.style.display = "none";
    }
  }
};

/**
 * Hides the mobile cart FAB button
 */
let hideMobileCartFAB = () => {
  let fab = document.getElementById("mobileCartFAB");
  if (fab) {
    fab.style.display = "none";
  }
};

/**
 * Initializes mobile cart on page load
 */
let initMobileCartOnLoad = () => {
  if (window.cartUI) {
    window.cartUI.createMobileCartFAB();
    window.cartUI.showMobileCartFAB();
  }
};

/**
 * Handles window resize for mobile cart
 */
let handleWindowResize = () => {
  if (window.cartUI) {
    window.cartUI.showMobileCartFAB();
  }
};

// Initialisierung für mobilen Warenkorb-FAB
document.addEventListener("DOMContentLoaded", () => {
  initMobileCartOnLoad();
});

window.addEventListener("resize", () => {
  handleWindowResize();
});

// Make globally available
window.cartUI = {
  loadCartModal,
  createMobileCartFAB,
  openCartModal,
  closeCartModal,
  renderCartItems,
  showMobileCartFAB,
  hideMobileCartFAB,
  initCartItemEventListeners,
  handleCartItemClick,
};// End of cart-ui.js