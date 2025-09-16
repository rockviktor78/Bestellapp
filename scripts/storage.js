/**
 * Saves cart data to LocalStorage
 * @param {Array} cartData - The cart data to save
 */
let saveCartData = (cartData) => {
  let serializedData = serializeCartData(cartData);
  storeCartInLocalStorage(serializedData);
};

/**
 * Loads cart data from LocalStorage
 * @returns {Array} The saved cart data or an empty array
 */
let loadCartData = () => {
  let rawData = getCartFromLocalStorage();
  return parseCartData(rawData);
};

/**
 * Deletes all cart data from LocalStorage
 */
let clearCartData = () => {
  removeCartFromLocalStorage();
};

/**
 * Serializes cart data to JSON string
 * @param {Array} cartData - The cart data to serialize
 * @returns {string} Serialized cart data
 */
let serializeCartData = (cartData) => {
  return JSON.stringify(cartData);
};

/**
 * Stores serialized cart data in localStorage
 * @param {string} serializedData - The serialized cart data
 */
let storeCartInLocalStorage = (serializedData) => {
  localStorage.setItem("mampfen-rando-cart", serializedData);
};

/**
 * Gets raw cart data from localStorage
 * @returns {string|null} Raw cart data or null
 */
let getCartFromLocalStorage = () => {
  return localStorage.getItem("mampfen-rando-cart");
};

/**
 * Parses raw cart data from localStorage
 * @param {string|null} rawData - Raw cart data
 * @returns {Array} Parsed cart data or empty array
 */
let parseCartData = (rawData) => {
  return rawData ? JSON.parse(rawData) : [];
};

/**
 * Removes cart data from localStorage
 */
let removeCartFromLocalStorage = () => {
  localStorage.removeItem("mampfen-rando-cart");
};

// Make globally available with backward compatibility
window.storageHandler = {
  saveCart: saveCartData,
  loadCart: loadCartData,
  clearCart: clearCartData,
};
