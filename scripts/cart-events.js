// Cart Event Handlers and Checkout
/**
 * Initializes all event listeners for the cart modal
 */
let initCartModal = () => {
  document.addEventListener("click", handleCartModalClicks);
};

/**
 * Handles all clicks for the cart modal
 * @param {Event} e - The click event
 */
let handleCartModalClicks = (e) => {
  if (isCartOpenButton(e.target.id)) {
    e.preventDefault();
    e.stopPropagation();
    if (window.cartUI) {
      window.cartUI.openCartModal();
    }
  } else if (isCartCloseButton(e.target.id)) {
    if (window.cartUI) {
      window.cartUI.closeCartModal();
    }
  } else if (e.target.id === "cartEmptyMenuBtn") {
    handleEmptyCartMenuClick();
  } else if (e.target.id === "cartCheckoutBtn") {
    processCheckout();
  }
};

/**
 * Checks if a button is for opening the cart
 * @param {string} buttonId - The button ID
 * @returns {boolean} True if it is an open button
 */
let isCartOpenButton = (buttonId) => {
  return (
    buttonId === "basketBtn" ||
    buttonId === "mobileBasketBtn" ||
    buttonId === "mobileCartFAB"
  );
};

/**
 * Checks if a button is for closing the cart
 * @param {string} buttonId - The button ID
 * @returns {boolean} True if it is a close button
 */
let isCartCloseButton = (buttonId) => {
  return buttonId === "cartModalClose" || buttonId === "cartModalOverlay";
};

/**
 * Handles click on "Back to menu" in empty cart
 */
let handleEmptyCartMenuClick = () => {
  if (window.cartUI) {
    window.cartUI.closeCartModal();
  }
  if (window.navigationHandler) {
    window.navigationHandler.navigateToMenu();
  }
};

/**
 * Initializes the "Back to menu" button in the empty cart
 */
let initEmptyCartButton = () => {
  let checkModal = setInterval(() => {
    let emptyCartBtn = document.getElementById("cartEmptyMenuBtn");
    if (emptyCartBtn) {
      clearInterval(checkModal);
      emptyCartBtn.addEventListener("click", handleEmptyCartButtonClick);
    }
  }, 100);

  setTimeout(() => clearInterval(checkModal), 5000);
};

/**
 * Handles click on the "Back to menu" button
 * @param {Event} e - The click event
 */
let handleEmptyCartButtonClick = (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (window.cartUI) {
    window.cartUI.closeCartModal();
  }

  if (window.navigationHandler) {
    window.navigationHandler.navigateToMenu();
  }
};

/**
 * Processes the checkout with popup confirmations
 */
let processCheckout = () => {
  if (!validateCheckoutRequirements()) return;

  let checkoutValidation = validateMinimumOrder();
  if (!checkoutValidation.isValid) {
    showCheckoutPopup(checkoutValidation.message, "error");
    return;
  }

  executeCheckout();
};

/**
 * Validates basic checkout requirements
 * @returns {boolean} True if checkout can proceed
 */
let validateCheckoutRequirements = () => {
  if (!window.cartCore) return false;
  let cart = window.cartCore.getCart();
  return cart.length > 0;
};

/**
 * Validates minimum order requirements
 * @returns {Object} Validation result with isValid and message
 */
let validateMinimumOrder = () => {
  let delivery = calculateDeliveryInfo();
  let orderValue = window.cartCore.getCartTotal();

  if (delivery && orderValue < delivery.minOrder) {
    return {
      isValid: false,
      message: `Mindestbestellwert für diese Entfernung: ${delivery.minOrder} €`,
    };
  }

  return { isValid: true };
};

/**
 * Calculates delivery information
 * @returns {Object|null} Delivery info or null if not available
 */
let calculateDeliveryInfo = () => {
  let distanceKm = parseFloat(localStorage.getItem("deliveryDistance")) || 2;
  let orderValue = window.cartCore.getCartTotal();

  return window.delivery
    ? window.delivery.calculateDelivery(distanceKm, orderValue)
    : null;
};

/**
 * Executes the checkout process
 */
let executeCheckout = () => {
  let checkoutBtn = prepareCheckoutButton();
  if (!checkoutBtn) return;

  let deliveryText = generateDeliveryText();
  showCheckoutPopup(`Ihre Testbestellung wurde erfolgreich aufgegeben.",${deliveryText}`, "success");
  scheduleThankYouMessage(checkoutBtn);
};

/**
 * Prepares the checkout button for processing
 * @returns {HTMLElement|null} The checkout button element
 */
let prepareCheckoutButton = () => {
  let checkoutBtn = document.getElementById("cartCheckoutBtn");
  if (checkoutBtn) {
    checkoutBtn.disabled = true;
    checkoutBtn.textContent = "Wird bearbeitet...";
  }
  return checkoutBtn;
};

/**
 * Generates delivery text for checkout message
 * @returns {string} Formatted delivery text
 */
let generateDeliveryText = () => {
  let delivery = calculateDeliveryInfo();
  if (!delivery) return "";

  let costText = formatDeliveryCost(delivery.deliveryCost);
  return `<br>Lieferkosten: <b>${costText}</b>`;
};

/**
 * Formats delivery cost for display
 * @param {number|null} deliveryCost - The delivery cost
 * @returns {string} Formatted cost text
 */
let formatDeliveryCost = (deliveryCost) => {
  if (deliveryCost === 0) return "kostenlos";
  if (deliveryCost !== null) return `${deliveryCost.toFixed(2)} €`;
  return "nach Absprache";
};

/**
 * Schedules the thank you message after checkout
 * @param {HTMLButtonElement} checkoutBtn - The checkout button
 */
let scheduleThankYouMessage = (checkoutBtn) => {
  setTimeout(() => {
    showCheckoutPopup("Danke für deine Testbestellung!", "success");
    scheduleCartClear(checkoutBtn);
  }, 2000);
};

/**
 * Schedules clearing the cart after checkout
 * @param {HTMLButtonElement} checkoutBtn - The checkout button
 */
let scheduleCartClear = (checkoutBtn) => {
  setTimeout(() => {
    if (window.cartCore) {
      window.cartCore.clearCart();
    }
    if (window.cartUI) {
      window.cartUI.closeCartModal();
    }
    resetCheckoutButton(checkoutBtn);
  }, 2000);
};

/**
 * Resets the checkout button to initial state
 * @param {HTMLButtonElement} checkoutBtn - The checkout button
 */
let resetCheckoutButton = (checkoutBtn) => {
  checkoutBtn.disabled = false;
  checkoutBtn.textContent = "Zur Kasse";
};

/**
 * Shows a checkout popup with a message
 * @param {string} message - The message to display
 * @param {string} type - The popup type (success/error)
 */
let showCheckoutPopup = (message, type = "success") => {
  let popup = createCheckoutPopup(message, type);
  showPopupWithAnimation(popup);
};

/**
 * Creates a checkout popup element
 * @param {string} message - The message
 * @param {string} type - The popup type
 * @returns {HTMLElement} The popup element
 */
let createCheckoutPopup = (message, type) => {
  let popup = createPopupElement(message, type);
  stylePopupElement(popup);
  return popup;
};

/**
 * Creates the basic popup DOM element
 * @param {string} message - The message
 * @param {string} type - The popup type
 * @returns {HTMLElement} The popup element
 */
let createPopupElement = (message, type) => {
  let popup = document.createElement("div");
  popup.className = "checkout-popup";
  setPopupContent(popup, message, type);
  return popup;
};

/**
 * Sets the popup content using template or fallback
 * @param {HTMLElement} popup - The popup element
 * @param {string} message - The message
 * @param {string} type - The popup type
 */
let setPopupContent = (popup, message, type) => {
  if (window.templateHTML && window.templateHTML.getCheckoutPopupHTML) {
    popup.innerHTML = window.templateHTML.getCheckoutPopupHTML(message, type);
  } else {
    popup.innerHTML = getFallbackPopupHTML(message, type);
  }
};

/**
 * Gets fallback popup HTML when template is unavailable
 * @param {string} message - The message
 * @param {string} type - The popup type
 * @returns {string} HTML string
 */
let getFallbackPopupHTML = (message, type) => {
    console.warn("getFallbackPopupHTML sollte nicht verwendet werden!");
  return "";
};

/**
 * Applies styling to popup element
 * @param {HTMLElement} popup - The popup element
 */
let stylePopupElement = (popup) => {
  popup.style.position = "fixed";
  popup.style.top = "50%";
  popup.style.left = "50%";
  popup.style.transform = "translate(-50%, -50%)";
  popup.style.zIndex = "10001";
  popup.style.opacity = "0";
  popup.style.transition = "opacity 0.3s ease";
};

/**
 * Shows popup with animation
 * @param {HTMLElement} popup - The popup element
 */
let showPopupWithAnimation = (popup) => {
  document.body.appendChild(popup);

  setTimeout(() => {
    popup.style.opacity = "1";
  }, 10);

  setTimeout(() => {
    popup.style.opacity = "0";
    setTimeout(() => {
      if (document.body.contains(popup)) {
        document.body.removeChild(popup);
      }
    }, 300);
  }, 1500);
};

/**
 * Initializes event listeners for page load events
 */
let initPageLoadedListener = () => {
  document.addEventListener("pageLoaded", (event) => {
    if (event.detail.page === "menu") {
      if (window.cartCore) {
        window.cartCore.initAddButtons();
      }
      if (window.cartUI) {
        window.cartUI.showMobileCartFAB();
      }
    } else {
      if (window.cartUI) {
        window.cartUI.hideMobileCartFAB();
      }
    }
  });
};

// Make globally available
window.cartEvents = {
  initCartModal,
  initEmptyCartButton,
  initPageLoadedListener,
  processCheckout,
};  // End of cart-events.js
