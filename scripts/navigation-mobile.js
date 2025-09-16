// Mobile Navigation Module
/**
 * Opens or closes the mobile menu based on the current state
 */
let toggleMobileMenu = () => {
  let mobileMenu = document.getElementById("mobileMenu");
  let isOpen = mobileMenu.classList.contains("header_mobile-menu--open");

  if (isOpen) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
};

/**
 * Opens the mobile menu
 */
let openMobileMenu = () => {
  let mobileMenu = document.getElementById("mobileMenu");
  let mobileMenuToggle = document.getElementById("mobileMenuToggle");

  mobileMenu.classList.add("header_mobile-menu--open");
  mobileMenuToggle.setAttribute("aria-label", "Menü schließen");
  document.body.style.overflow = "hidden";
};

/**
 * Closes the mobile menu
 */
let closeMobileMenu = () => {
  let mobileMenu = document.getElementById("mobileMenu");
  let mobileMenuToggle = document.getElementById("mobileMenuToggle");

  mobileMenu.classList.remove("header_mobile-menu--open");
  mobileMenuToggle.setAttribute("aria-label", "Menü öffnen");
  document.body.style.overflow = "";
};

/**
 * Handles clicks outside of the mobile menu
 * @param {Event} event - The click event
 */
let handleMobileMenuOutsideClick = (event) => {
  if (shouldCloseMobileMenu(event)) {
    closeMobileMenu();
  }
};

/**
 * Determines if mobile menu should close based on click
 * @param {Event} event - The click event
 * @returns {boolean} True if menu should close
 */
let shouldCloseMobileMenu = (event) => {
  let mobileMenu = document.getElementById("mobileMenu");
  let mobileMenuToggle = document.getElementById("mobileMenuToggle");

  let isMenuOpen = isMobileMenuOpen(mobileMenu);
  let clickedOutsideMenu = !isClickInsideMenu(
    event,
    mobileMenu,
    mobileMenuToggle
  );

  return isMenuOpen && clickedOutsideMenu;
};

/**
 * Checks if mobile menu is currently open
 * @param {HTMLElement} mobileMenu - The mobile menu element
 * @returns {boolean} True if menu is open
 */
let isMobileMenuOpen = (mobileMenu) => {
  return mobileMenu.classList.contains("header_mobile-menu--open");
};

/**
 * Checks if click was inside menu or toggle
 * @param {Event} event - The click event
 * @param {HTMLElement} mobileMenu - The mobile menu element
 * @param {HTMLElement} mobileMenuToggle - The toggle button element
 * @returns {boolean} True if click was inside menu or toggle
 */
let isClickInsideMenu = (event, mobileMenu, mobileMenuToggle) => {
  let clickedInsideMenu = mobileMenu.contains(event.target);
  let clickedToggle = mobileMenuToggle.contains(event.target);
  return clickedInsideMenu || clickedToggle;
};

/**
 * Initializes the mobile navigation event listeners
 */
let initMobileNavigation = () => {
  let mobileMenuToggle = document.getElementById("mobileMenuToggle");
  let mobileMenu = document.getElementById("mobileMenu");
  let mobileMenuClose = document.getElementById("mobileMenuClose");

  if (mobileMenuToggle && mobileMenu && mobileMenuClose) {
    mobileMenuToggle.addEventListener("click", toggleMobileMenu);
    mobileMenuClose.addEventListener("click", closeMobileMenu);
    document.addEventListener("click", handleMobileMenuOutsideClick);
  }
};

/**
 * Closes the mobile menu when navigating if it is open
 */
let closeMenuIfNavigating = () => {
  let mobileMenu = document.getElementById("mobileMenu");
  if (mobileMenu?.classList.contains("header_mobile-menu--open")) {
    closeMobileMenu();
  }
};

// Make globally available
window.navigationMobile = {
  toggleMobileMenu,
  openMobileMenu,
  closeMobileMenu,
  initMobileNavigation,
  closeMenuIfNavigating,
}; // End of navigation-mobile.js
