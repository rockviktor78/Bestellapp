// Navigation Core Module
// Navigation state
let navigationCurrentPage = "home";
let navigationContentContainer = null;

/**
 * Initializes the content container
 */
let initContentContainer = () => {
  navigationContentContainer = document.getElementById("content");
};

/**
 * Navigates to the home page
 */
let navigateToHome = () => {
  loadContent("templates/home-content.html", "home");
};

/**
 * Navigates to the menu page
 */
let navigateToMenu = () => {
  loadContent("templates/menu-content.html", "menu");
};

/**
 * Navigates to the about page
 */
let navigateToAbout = () => {
  loadContent("templates/about-content.html", "about");
};

/**
 * Navigates to the contact page
 */
let navigateToContact = () => {
  loadContent("templates/contact-content.html", "contact");
};

/**
 * Navigates to the privacy page
 */
let navigateToPrivacy = () => {
  loadContent("templates/privacy-content.html", "privacy");
};

/**
 * Navigates to the basket
 */
let navigateToBasket = () => {
  if (window.navigationMobile) {
    window.navigationMobile.closeMenuIfNavigating();
  }
};

/**
 * Loads content from a template path
 * @param {string} templatePath - Path to the template
 * @param {string} pageName - Name of the page
 */
let loadContent = async (templatePath, pageName) => {
  if (!validateContentContainer()) return;

  let contentData = await fetchTemplateContent(templatePath);
  if (contentData.success) {
    updatePageContent(contentData.html, pageName);
    executePostLoadActions(pageName);
  }

  closeMobileMenuIfOpen();
};

/**
 * Validates that content container exists
 * @returns {boolean} True if container is available
 */
let validateContentContainer = () => {
  return !!navigationContentContainer;
};

/**
 * Fetches template content from given path
 * @param {string} templatePath - Path to the template
 * @returns {Object} Result object with success and html
 */
let fetchTemplateContent = async (templatePath) => {
  let response = await fetch(templatePath);
  return {
    success: response.ok,
    html: response.ok ? await response.text() : "",
  };
};

/**
 * Updates page content and navigation state
 * @param {string} html - HTML content to set
 * @param {string} pageName - Name of the page
 */
let updatePageContent = (html, pageName) => {
  navigationContentContainer.innerHTML = html;
  navigationCurrentPage = pageName;
};

/**
 * Executes post-load actions for the page
 * @param {string} pageName - Name of the loaded page
 */
let executePostLoadActions = (pageName) => {
  updateActiveStates();
  triggerPageLoadedEvent(pageName);
  handleMenuPageFAB(pageName);
};

/**
 * Closes mobile menu if navigation is happening
 */
let closeMobileMenuIfOpen = () => {
  if (window.navigationMobile) {
    window.navigationMobile.closeMenuIfNavigating();
  }
};

/**
 * Triggers a custom event when a page is loaded
 * @param {string} pageName - The name of the loaded page
 */
let triggerPageLoadedEvent = (pageName) => {
  let event = new CustomEvent("pageLoaded", {
    detail: { page: pageName, container: navigationContentContainer },
  });
  document.dispatchEvent(event);
};

/**
 * Handles FAB updates for the menu page
 * @param {string} pageName - The name of the loaded page
 */
let handleMenuPageFAB = (pageName) => {
  if (isMenuPage(pageName) && window.cartUI) {
    scheduleCartFABDisplay();
  }
};

/**
 * Checks if the current page is menu
 * @param {string} pageName - The page name to check
 * @returns {boolean} True if it is menu page
 */
let isMenuPage = (pageName) => {
  return pageName === "menu";
};

/**
 * Schedules cart FAB display with delay
 */
let scheduleCartFABDisplay = () => {
  setTimeout(() => {
    showCartFABIfAvailable();
  }, 100);
};

/**
 * Shows cart FAB if available
 */
let showCartFABIfAvailable = () => {
  if (window.cartUI && window.cartUI.showMobileCartFAB) {
    window.cartUI.showMobileCartFAB();
  }
};

/**
 * Updates active navigation button states
 */
let updateActiveStates = () => {
  resetAllActiveStates();
  setActiveStateForCurrentPage();
};

/**
 * Resets active states for all navigation buttons
 */
let resetAllActiveStates = () => {
  document
    .querySelectorAll(".header_nav-btn, .header_mobile-btn")
    .forEach((btn) => {
      btn.classList.remove("active");
    });
};

/**
 * Sets active state for current page buttons
 */
let setActiveStateForCurrentPage = () => {
  let activeButtons = getActiveButtonsForPage(navigationCurrentPage);
  if (activeButtons) {
    activateButtons(activeButtons);
  }
};

/**
 * Gets button IDs for a specific page
 * @param {string} pageName - The page name
 * @returns {Array|null} Array of button IDs or null
 */
let getActiveButtonsForPage = (pageName) => {
  let buttonMappings = {
    home: ["homeBtn", "mobileHomeBtn"],
    menu: ["menuBtn", "mobileMenuBtn"],
    about: ["aboutBtn", "mobileAboutBtn"],
    contact: ["contactBtn", "mobileContactBtn"],
  };

  return buttonMappings[pageName] || null;
};

/**
 * Activates buttons by their IDs
 * @param {Array} buttonIds - Array of button IDs
 */
let activateButtons = (buttonIds) => {
  buttonIds.forEach((btnId) => {
    let btn = document.getElementById(btnId);
    if (shouldActivateButton(btn)) {
      btn.classList.add("active");
    }
  });
};

/**
 * Checks if a button should be activated
 * @param {HTMLElement} btn - The button element
 * @returns {boolean} True if button should be activated
 */
let shouldActivateButton = (btn) => {
  return btn && !btn.classList.contains("header_nav-btn--basket");
};

/**
 * Navigates to a specific menu category
 * @param {string} category - The category (pizza, pasta, etc.)
 */
let navigateToMenuCategory = (category) => {
  navigateToMenu();
  setTimeout(() => {
    scrollToCategoryElement(category);
  }, 300);
};

/**
 * Scrolls to a category element
 * @param {string} category - The category to scroll to
 */
let scrollToCategoryElement = (category) => {
  let categoryElement = document.querySelector(`[data-category="${category}"]`);
  if (!categoryElement) {
    categoryElement = findCategoryByTitle(category);
  }
  if (categoryElement) {
    categoryElement.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

/**
 * Finds a category element by its title
 * @param {string} category - The category to search
 * @returns {Element|null} The found element or null
 */
let findCategoryByTitle = (category) => {
  return Array.from(document.querySelectorAll(".category_title")).find((el) =>
    el.textContent.trim().toLowerCase().includes(category)
  );
};

/**
 * Initializes all navigation event listeners
 */
let initNavigationEventListeners = () => {
  let navigationMappings = getNavigationMappings();
  navigationMappings.forEach(({ buttonId, navigationFunction }) => {
    attachNavigationListener(buttonId, navigationFunction);
  });
};

/**
 * Gets navigation button to function mappings
 * @returns {Array} Array of navigation mappings
 */
let getNavigationMappings = () => {
  return [
    { buttonId: "logoHomeBtn", navigationFunction: navigateToHome },
    { buttonId: "mobileHomeBtn", navigationFunction: navigateToHome },
    { buttonId: "homeBtn", navigationFunction: navigateToHome },
    { buttonId: "mobileMenuBtn", navigationFunction: navigateToMenu },
    { buttonId: "menuBtn", navigationFunction: navigateToMenu },
    { buttonId: "mobileAboutBtn", navigationFunction: navigateToAbout },
    { buttonId: "aboutBtn", navigationFunction: navigateToAbout },
    { buttonId: "mobileContactBtn", navigationFunction: navigateToContact },
    { buttonId: "contactBtn", navigationFunction: navigateToContact },
    { buttonId: "mobileBasketBtn", navigationFunction: navigateToBasket },
    { buttonId: "basketBtn", navigationFunction: navigateToBasket },
  ];
};

/**
 * Attaches navigation listener to a button
 * @param {string} buttonId - The button ID
 * @param {Function} navigationFunction - The navigation function
 */
let attachNavigationListener = (buttonId, navigationFunction) => {
  let button = document.getElementById(buttonId);
  if (button && isValidNavigationFunction(navigationFunction)) {
    button.addEventListener("click", navigationFunction);
  }
};

/**
 * Validates if navigation function exists and is callable
 * @param {Function} navigationFunction - The function to validate
 * @returns {boolean} True if function is valid
 */
let isValidNavigationFunction = (navigationFunction) => {
  return typeof navigationFunction === "function";
};

/**
 * Initializes event listeners for dynamically loaded content
 */
let initDynamicEventListeners = () => {
  document.addEventListener("pageLoaded", (event) => {
    if (event.detail.page === "home" && window.navigationForms) {
      window.navigationForms.initHeroButton();
      window.navigationForms.initFeatureCards();
    }

    if (event.detail.page === "contact" && window.navigationForms) {
      window.navigationForms.initContactForm();
    }
  });
};

// Make globally available
window.navigationCore = {
  navigateToHome,
  navigateToMenu,
  navigateToAbout,
  navigateToContact,
  navigateToPrivacy,
  navigateToBasket,
  navigateToMenuCategory,
  initContentContainer,
  initNavigationEventListeners,
  initDynamicEventListeners,
};  // End of navigation-core.js
