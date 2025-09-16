// Cart Main Module - Orchestrates all cart functionality
/**
 * Initializes the entire shopping cart
 */
let initCart = async () => {
  // Load UI components
  if (window.cartUI) {
    await window.cartUI.loadCartModal();
    window.cartUI.createMobileCartFAB();
  }

  // Initialize core functionality
  if (window.cartCore) {
    window.cartCore.updateCartDisplay();
    window.cartCore.initAddButtons();
  }

  // Initialize event handlers
  if (window.cartEvents) {
    window.cartEvents.initCartModal();
    window.cartEvents.initEmptyCartButton();
    window.cartEvents.initPageLoadedListener();
  }
};

// Make globally available for backward compatibility
window.cartHandler = {
  addToCart: (name, price, buttonElement) =>
    window.cartCore?.addToCart(name, price, buttonElement),
  increaseQuantity: (name) => window.cartCore?.increaseQuantity(name),
  decreaseQuantity: (name) => window.cartCore?.decreaseQuantity(name),
  removeItemFromCart: (name) => window.cartCore?.removeItemFromCart(name),
  openCartModal: () => window.cartUI?.openCartModal(),
  closeCartModal: () => window.cartUI?.closeCartModal(),
  showMobileCartFAB: () => window.cartUI?.showMobileCartFAB(),
  hideMobileCartFAB: () => window.cartUI?.hideMobileCartFAB(),
  getCart: () => window.cartCore?.getCart() || [],
  getCartTotal: () => window.cartCore?.getCartTotal() || 0,
};

// Initialization
document.addEventListener("DOMContentLoaded", () => {
  // Ensure all modules are loaded before initializing
  let checkModules = setInterval(() => {
    if (window.cartCore && window.cartUI && window.cartEvents) {
      clearInterval(checkModules);
      initCart();
    }
  }, 50);

  // Timeout fallback
  setTimeout(() => {
    clearInterval(checkModules);
    if (!window.cartCore || !window.cartUI || !window.cartEvents) {
      console.warn(
        "Some cart modules are not loaded. Cart functionality may be limited."
      );
    }
  }, 5000);
});

// Export for modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    initCart,
  };
};
// End of cart.js

