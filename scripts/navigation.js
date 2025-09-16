// Navigation Main Module - Orchestrates all navigation functionality
/**
 * Initializes navigation after DOM load
 */
function initNavigation() {
  initMobileNavigation();
  initCoreNavigation();
}

/**
 * Initializes mobile navigation if available
 */
let initMobileNavigation = () => {
  if (window.navigationMobile) {
    window.navigationMobile.initMobileNavigation();
  }
};

/**
 * Initializes core navigation if available
 */
let initCoreNavigation = () => {
  if (window.navigationCore) {
    window.navigationCore.initContentContainer();
    window.navigationCore.initNavigationEventListeners();
    window.navigationCore.initDynamicEventListeners();
  }
};

// Global navigation functions for backward compatibility
window.navigationHandler = {
  navigateToHome: () => window.navigationCore?.navigateToHome(),
  navigateToMenu: () => window.navigationCore?.navigateToMenu(),
  navigateToAbout: () => window.navigationCore?.navigateToAbout(),
  navigateToContact: () => window.navigationCore?.navigateToContact(),
  navigateToPrivacy: () => window.navigationCore?.navigateToPrivacy(),
  navigateToBasket: () => window.navigationCore?.navigateToBasket(),
  navigateToMenuCategory: (category) =>
    window.navigationCore?.navigateToMenuCategory(category),
};

// Event listeners for initialization
document.addEventListener("DOMContentLoaded", () => {
  waitForModulesAndInit();
});

/**
 * Waits for all modules to load then initializes navigation
 */
let waitForModulesAndInit = () => {
  let checkModules = setInterval(() => {
    if (areAllModulesLoaded()) {
      clearInterval(checkModules);
      initNavigation();
    }
  }, 50);

  scheduleTimeoutFallback(checkModules);
};

/**
 * Checks if all required navigation modules are loaded
 * @returns {boolean} True if all modules are loaded
 */
let areAllModulesLoaded = () => {
  return (
    window.navigationCore && window.navigationMobile && window.navigationForms
  );
};

/**
 * Schedules timeout fallback for module loading
 * @param {number} checkModules - The interval ID
 */
let scheduleTimeoutFallback = (checkModules) => {
  setTimeout(() => {
    clearInterval(checkModules);
    if (!areAllModulesLoaded()) {
      console.warn(
        "Some navigation modules are not loaded. Navigation functionality may be limited."
      );
    }
  }, 5000);
};

document.addEventListener("htmlIncluded", initNavigation);
document.addEventListener("contentLoaded", initNavigation);

// Event delegation for buttons in #content
document.addEventListener("DOMContentLoaded", function () {
  initContentEventDelegation();
});

/**
 * Initializes event delegation for content area
 */
let initContentEventDelegation = () => {
  let content = document.getElementById("content");
  if (content) {
    content.addEventListener("click", handleContentClick);
  }
};

/**
 * Handles clicks in the content area
 * @param {Event} e - The click event
 */
let handleContentClick = (e) => {
  if (isHeroOrderButton(e.target)) {
    handleHeroOrderClick(e);
  }

  let card = e.target.closest(".feature_card");
  if (card) {
    handleFeatureCardClick(e, card);
  }
};

/**
 * Checks if clicked element is hero order button
 * @param {HTMLElement} target - The clicked element
 * @returns {boolean} True if it is hero order button
 */
let isHeroOrderButton = (target) => {
  return target && target.id === "heroOrderBtn";
};

/**
 * Handles hero order button click
 * @param {Event} e - The click event
 */
let handleHeroOrderClick = (e) => {
  e.preventDefault();
  window.navigationHandler.navigateToMenu();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

/**
 * Handles feature card click
 * @param {Event} e - The click event
 * @param {HTMLElement} card - The feature card element
 */
let handleFeatureCardClick = (e, card) => {
  e.preventDefault();
  let category = card.getAttribute("data-category");
  let action = card.getAttribute("data-action");

  if (category && window.navigationHandler) {
    window.navigationHandler.navigateToMenuCategory(category);
  }

  if (action === "menu" && window.navigationHandler) {
    window.navigationHandler.navigateToMenu();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};
