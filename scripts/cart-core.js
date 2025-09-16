// Cart Core Functionality
// Basket State
let cart = [];
let cartCount = 0;

/**
 * Adds an item to the cart
 * @param {string} name - The item name
 * @param {number} price - The item price
 * @param {HTMLElement} buttonElement - The button element (optional)
 */
let addToCart = (name, price, buttonElement = null) => {
  addItemToCartState(name, price);
  updateCartCount();
  updateCartDisplay();
  showAddToCartMessage(name, buttonElement);
};

/**
 * Adds an item to the cart state (pure logic)
 * @param {string} name - The item name
 * @param {number} price - The item price
 */
let addItemToCartState = (name, price) => {
  let existingItem = findCartItem(name);
  if (existingItem) {
    increaseItemQuantity(existingItem);
  } else {
    createNewCartItem(name, price);
  }
};

/**
 * Finds an existing item in the cart
 * @param {string} name - The item name
 * @returns {Object|undefined} The cart item or undefined
 */
let findCartItem = (name) => {
  return cart.find((item) => item.name === name);
};

/**
 * Increases the quantity of an existing item
 * @param {Object} item - The cart item object
 */
let increaseItemQuantity = (item) => {
  item.quantity += 1;
};

/**
 * Creates a new cart item
 * @param {string} name - The item name
 * @param {number} price - The item price
 */
let createNewCartItem = (name, price) => {
  cart.push({ name: name, price: price, quantity: 1 });
};

/**
 * Updates the cart count by one
 */
let updateCartCount = () => {
  cartCount += 1;
};

/**
 * Increases the quantity of an item in the cart
 * @param {string} name - The item name
 */
let increaseQuantity = (name) => {
  let item = findCartItem(name);
  if (item) {
    increaseItemQuantity(item);
    updateCartCount();
    updateCartDisplay();
    triggerCartUIUpdate();
  }
};

/**
 * Decreases the quantity of an item in the cart
 * @param {string} name - The item name
 */
let decreaseQuantity = (name) => {
  let item = findCartItem(name);
  if (item && item.quantity > 1) {
    decreaseItemQuantity(item);
    decreaseCartCount();
    updateCartDisplay();
    triggerCartUIUpdate();
  } else if (item) {
    removeItemFromCart(name);
  }
};

/**
 * Decreases the quantity of an existing item
 * @param {Object} item - The cart item object
 */
let decreaseItemQuantity = (item) => {
  item.quantity -= 1;
};

/**
 * Decreases the cart count by one
 */
let decreaseCartCount = () => {
  cartCount -= 1;
};

/**
 * Triggers cart UI update if available
 */
let triggerCartUIUpdate = () => {
  if (window.cartUI && typeof window.cartUI.renderCartItems === "function") {
    window.cartUI.renderCartItems();
  }
};

/**
 * Removes an item completely from the cart
 * @param {string} name - The item name to remove
 */
let removeItemFromCart = (name) => {
  let itemToRemove = cart.find((cartItem) => cartItem.name === name);
  if (itemToRemove) {
    cartCount -= itemToRemove.quantity;
    cart = cart.filter((cartItem) => cartItem.name !== name);
    updateCartDisplay();
    triggerCartUIUpdate();
  }
};

/**
 * Clears the entire cart
 */
let clearCart = () => {
  cart = [];
  cartCount = 0;
  updateCartDisplay();
  triggerCartUIUpdate();
};

/**
 * Returns the current cart
 * @returns {Array} The cart with all items
 */
let getCart = () => {
  return cart;
};

/**
 * Calculates the total sum of the cart
 * @returns {number} The total sum
 */
let getCartTotal = () => {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
};

/**
 * Updates the cart display in header and FAB
 */
let updateCartDisplay = () => {
  let basketCount = document.getElementById("basketCount");
  let mobileBasketCount = document.getElementById("mobileBasketCount");
  let fabCount = document.getElementById("mobileCartFABCount");

  if (basketCount) basketCount.textContent = cartCount;
  if (mobileBasketCount) mobileBasketCount.textContent = cartCount;
  if (fabCount) {
    fabCount.textContent = cartCount;
    fabCount.style.display = cartCount > 0 ? "flex" : "none";
  }
};

/**
 * Shows a confirmation message when an item is added to cart
 * @param {string} itemName - The name of the added item
 * @param {HTMLElement} buttonElement - The button element that was clicked
 */
let showAddToCartMessage = (itemName, buttonElement) => {
  let message = createMessageElement(itemName);
  positionMessage(message, buttonElement);
  showAndHideMessage(message);
};

/**
 * Creates the message element with HTML template
 * @param {string} itemName - The item name
 * @returns {HTMLElement} The message element
 */
let createMessageElement = (itemName) => {
  let message = document.createElement("div");
  message.className = "add-to-cart-message";
  if (window.templateHTML && window.templateHTML.getAddToCartMessageHTML) {
    message.innerHTML = window.templateHTML.getAddToCartMessageHTML(itemName);
  }
  return message;
};

/**
 * Positions the message relative to the button
 * @param {HTMLElement} message - The message element
 * @param {HTMLElement} buttonElement - The button element
 */
let positionMessage = (message, buttonElement) => {
  if (!buttonElement) return;

  let position = calculateMessagePosition(buttonElement);
  applyMessagePosition(message, position);
};

/**
 * Calculates message position based on button and screen size
 * @param {HTMLElement} buttonElement - The button element
 * @returns {Object} Position object with style properties
 */
let calculateMessagePosition = (buttonElement) => {
  let buttonRect = buttonElement.getBoundingClientRect();
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  let scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

  if (window.innerWidth <= 320) {
    return getSmallScreenPosition();
  } else {
    return getLargeScreenPosition(buttonRect, scrollTop, scrollLeft);
  }
};

/**
 * Gets position for small screens
 * @returns {Object} Position object
 */
let getSmallScreenPosition = () => {
  return {
    position: "fixed",
    top: "10px",
    left: "4px",
    right: "4px",
    width: "auto",
  };
};

/**
 * Gets position for large screens
 * @param {Object} buttonRect - Button rectangle
 * @param {number} scrollTop - Scroll top position
 * @param {number} scrollLeft - Scroll left position
 * @returns {Object} Position object
 */
let getLargeScreenPosition = (buttonRect, scrollTop, scrollLeft) => {
  let leftPosition = calculateLeftPosition(buttonRect.left + scrollLeft);

  return {
    position: "absolute",
    top: `${buttonRect.top + scrollTop - 50}px`,
    left: `${leftPosition}px`,
    width: "auto",
  };
};

/**
 * Calculates optimal left position for message
 * @param {number} baseLeft - Base left position
 * @returns {number} Calculated left position
 */
let calculateLeftPosition = (baseLeft) => {
  let messageWidth = Math.min(250, window.innerWidth - 20);

  if (baseLeft + messageWidth > window.innerWidth - 10) {
    return window.innerWidth - messageWidth - 10;
  }

  return Math.max(10, baseLeft);
};

/**
 * Applies position styles to message element
 * @param {HTMLElement} message - The message element
 * @param {Object} position - Position object with CSS properties
 */
let applyMessagePosition = (message, position) => {
  Object.keys(position).forEach((property) => {
    message.style[property] = position[property];
  });
};

/**
 * Shows and hides the message with animation
 * @param {HTMLElement} message - The message element
 */
let showAndHideMessage = (message) => {
  document.body.appendChild(message);
  animateMessageIn(message);
  scheduleMessageRemoval(message);
};

/**
 * Animates the message in
 * @param {HTMLElement} message - The message element
 */
let animateMessageIn = (message) => {
  setTimeout(() => {
    message.classList.add("add-to-cart-message--show");
  }, 10);
};

/**
 * Schedules message removal after delay
 * @param {HTMLElement} message - The message element
 */
let scheduleMessageRemoval = (message) => {
  setTimeout(() => {
    animateMessageOut(message);
  }, 2000);
};

/**
 * Animates the message out and removes it
 * @param {HTMLElement} message - The message element
 */
let animateMessageOut = (message) => {
  message.classList.remove("add-to-cart-message--show");
  setTimeout(() => {
    removeMessageFromDOM(message);
  }, 300);
};

/**
 * Removes message from DOM if it exists
 * @param {HTMLElement} message - The message element
 */
let removeMessageFromDOM = (message) => {
  if (document.body.contains(message)) {
    document.body.removeChild(message);
  }
};
/**
 * Initializes all "Add" buttons in the menu
 */
let initAddButtons = () => {
  document.querySelectorAll(".add_btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      let dishName = btn.getAttribute("data-name");
      let dishPrice = parseFloat(btn.getAttribute("data-price"));
      addToCart(dishName, dishPrice, btn);
    });
  });
};

// Make globally available
window.cartCore = {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeItemFromCart,
  clearCart,
  getCart,
  getCartTotal,
  updateCartDisplay,
  initAddButtons,
  showAddToCartMessage,
};
