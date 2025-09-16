// Navigation Forms and Popups Module
/**
 * Initializes the contact form with validation
 */
let initContactForm = () => {
  let contactForm = document.querySelector(".form");
  if (contactForm) {
    contactForm.addEventListener("submit", handleContactFormSubmit);
  }
};

/**
 * Handles the contact form submission
 * @param {Event} e - The submit event
 */
let handleContactFormSubmit = (e) => {
  e.preventDefault();
  let contactForm = e.target;
  let formBtn = contactForm.querySelector(".form_btn");

  if (validateContactForm(contactForm)) {
    processContactFormSubmission(formBtn, contactForm);
  }
};

/**
 * Validates the contact form
 * @param {HTMLFormElement} contactForm - The contact form
 * @returns {boolean} True if valid, false otherwise
 */
let validateContactForm = (contactForm) => {
  let formInputs = getFormInputs(contactForm);

  if (!validateRequiredFields(formInputs)) {
    showErrorPopup("Bitte füllen Sie alle Felder aus!");
    return false;
  }

  if (!validateEmailFormat(formInputs.email)) {
    showErrorPopup("Bitte geben Sie eine gültige E-Mail-Adresse ein!");
    return false;
  }

  return true;
};

/**
 * Gets form input elements
 * @param {HTMLFormElement} contactForm - The contact form
 * @returns {Object} Object with form inputs
 */
let getFormInputs = (contactForm) => {
  return {
    name: contactForm.querySelector('input[placeholder="Name"]'),
    email: contactForm.querySelector('input[placeholder="E-Mail"]'),
    message: contactForm.querySelector('textarea[placeholder="Ihre Nachricht an uns..."]'),
  };
};

/**
 * Validates required fields are filled
 * @param {Object} formInputs - Object with form inputs
 * @returns {boolean} True if all fields are filled
 */
let validateRequiredFields = (formInputs) => {
  return (
    formInputs.name.value.trim() &&
    formInputs.email.value.trim() &&
    formInputs.message.value.trim()
  );
};

/**
 * Validates email format
 * @param {HTMLInputElement} emailInput - The email input element
 * @returns {boolean} True if email format is valid
 */
let validateEmailFormat = (emailInput) => {
  let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(emailInput.value.trim());
};

/**
 * Processes the form submission
 * @param {HTMLButtonElement} formBtn - The submit button
 * @param {HTMLFormElement} contactForm - The contact form
 */
let processContactFormSubmission = async (formBtn, contactForm) => {
  setFormSubmittingState(formBtn);

  try {
    let success = await submitFormToService(contactForm);
    if (success) {
      handleFormSubmissionSuccess(contactForm);
    } else {
      handleFormSubmissionError();
    }
  } catch (error) {
    console.error("Form submission error:", error);
    handleFormSubmissionError();
  } finally {
    resetFormSubmittingState(formBtn);
  }
};

/**
 * Sets form to submitting state
 * @param {HTMLButtonElement} formBtn - The submit button
 */
let setFormSubmittingState = (formBtn) => {
  formBtn.textContent = "Wird gesendet...";
  formBtn.disabled = true;
};

/**
 * Submits form to external service
 * @param {HTMLFormElement} contactForm - The contact form
 * @returns {boolean} True if submission was successful
 */
let submitFormToService = async (contactForm) => {
  let formData = new FormData(contactForm);
  let response = await fetch(contactForm.action, {
    method: contactForm.method,
    body: formData,
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    let data = await response.json();
    throw new Error(data.error || "Server error");
  }

  return true;
};

/**
 * Handles successful form submission
 * @param {HTMLFormElement} contactForm - The contact form
 */
let handleFormSubmissionSuccess = (contactForm) => {
  showSuccessPopup();
  contactForm.reset();
};

/**
 * Handles form submission error
 */
let handleFormSubmissionError = () => {
  showErrorPopup("Fehler beim Senden. Bitte erneut versuchen.");
};

/**
 * Resets form from submitting state
 * @param {HTMLButtonElement} formBtn - The submit button
 */
let resetFormSubmittingState = (formBtn) => {
  formBtn.textContent = "Senden";
  formBtn.disabled = false;
};

/**
 * Shows form status message
 * @param {string} message - The status message
 * @param {string} type - The type of message ('success' or 'error')
 */
let showFormStatus = (message, type) => {
  let statusElement = document.getElementById("form-status");
  if (statusElement) {
    statusElement.textContent = message;
    statusElement.className = `form_status form_status--${type}`;
    statusElement.style.display = "block";

    // Hide status after 5 seconds
    setTimeout(() => {
      statusElement.style.display = "none";
      statusElement.textContent = "";
      statusElement.className = "form_status";
    }, 5000);
  }
};

/**
 * Shows a success popup
 */
let showSuccessPopup = () => {
  let popup = createSuccessPopupElement();
  showPopup(popup);
};

/**
 * Shows an error popup
 * @param {string} message - The error message
 */
let showErrorPopup = (message) => {
  let popup = createErrorPopupElement(message);
  showPopup(popup);
};

/**
 * Creates success popup element
 * @returns {HTMLElement} The success popup element
 */
let createSuccessPopupElement = () => {
  let popup = document.createElement("div");
  popup.className = "success-popup";
  setSuccessPopupContent(popup);
  return popup;
};

/**
 * Creates error popup element
 * @param {string} message - The error message
 * @returns {HTMLElement} The error popup element
 */
let createErrorPopupElement = (message) => {
  let popup = document.createElement("div");
  popup.className = "success-popup";
  setErrorPopupContent(popup, message);
  return popup;
};

/**
 * Sets success popup content
 * @param {HTMLElement} popup - The popup element
 */
let setSuccessPopupContent = (popup) => {
  if (window.templateHTML && window.templateHTML.getSuccessPopupHTML) {
    popup.innerHTML = window.templateHTML.getSuccessPopupHTML();
  } else {
    console.warn("templateHTML.getSuccessPopupHTML not available!");
  }
};

/**
 * Sets error popup content
 * @param {HTMLElement} popup - The popup element
 * @param {string} message - The error message
 */
let setErrorPopupContent = (popup, message) => {
  if (window.templateHTML && window.templateHTML.getErrorPopupHTML) {
    popup.innerHTML = window.templateHTML.getErrorPopupHTML(message);
  } else {
    console.warn("templateHTML.getErrorPopupHTML not available!");
  }
};

/**
 * Shows a popup in the correct position
 * @param {HTMLElement} popup - The popup element
 */
let showPopup = (popup) => {
  let formBtn = document.querySelector(".form_btn");

  if (formBtn) {
    let btnRect = formBtn.getBoundingClientRect();
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    popup.style.position = "absolute";
    popup.style.top = `${btnRect.bottom + scrollTop + 10}px`;
    popup.style.left = `${btnRect.left}px`;
    popup.style.right = "auto";
    popup.style.transform = "none";
  }

  document.body.appendChild(popup);
  setTimeout(() => popup.classList.add("success-popup--show"), 10);
  hidePopupAfterDelay(popup);
};

/**
 * Hides the popup after a delay
 * @param {HTMLElement} popup - The popup to hide
 */
let hidePopupAfterDelay = (popup) => {
  setTimeout(() => {
    popup.classList.remove("success-popup--show");
    setTimeout(() => {
      if (document.body.contains(popup)) {
        document.body.removeChild(popup);
      }
    }, 300);
  }, 3000);
};

/**
 * Initializes feature card listeners
 */
let initFeatureCards = () => {
  initPizzaFeatureCard();
  initPastaFeatureCard();
  initSaladFeatureCard();
  initDessertFeatureCard();
};

/**
 * Initializes pizza feature card
 */
let initPizzaFeatureCard = () => {
  let pizzaCard = document.getElementById("pizzaFeatureCard");
  if (pizzaCard) {
    pizzaCard.addEventListener("click", () => {
      if (window.navigationCore) {
        window.navigationCore.navigateToMenuCategory("pizza");
      }
    });
  }
};

/**
 * Initializes pasta feature card
 */
let initPastaFeatureCard = () => {
  let pastaCard = document.getElementById("pastaFeatureCard");
  if (pastaCard) {
    pastaCard.addEventListener("click", () => {
      if (window.navigationCore) {
        window.navigationCore.navigateToMenuCategory("pasta");
      }
    });
  }
};

/**
 * Initializes salad feature card
 */
let initSaladFeatureCard = () => {
  let saladCard = document.getElementById("saladFeatureCard");
  if (saladCard) {
    saladCard.addEventListener("click", () => {
      if (window.navigationCore) {
        window.navigationCore.navigateToMenuCategory("salad");
      }
    });
  }
};

/**
 * Initializes dessert feature card
 */
let initDessertFeatureCard = () => {
  let dessertCard = document.getElementById("dessertFeatureCard");
  if (dessertCard) {
    dessertCard.addEventListener("click", () => {
      if (window.navigationCore) {
        window.navigationCore.navigateToMenuCategory("dessert");
      }
    });
  }
};

/**
 * Initializes the hero button event listener
 */
let initHeroButton = () => {
  let heroBtn = document.getElementById("heroOrderBtn");
  if (heroBtn) {
    heroBtn.addEventListener("click", () => {
      if (window.navigationCore) {
        window.navigationCore.navigateToMenu();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }
};

// Make globally available
window.navigationForms = {
  initContactForm,
  initFeatureCards,
  initHeroButton,
  showSuccessPopup,
  showErrorPopup,
  showFormStatus,
};  // End of navigation-forms.js
