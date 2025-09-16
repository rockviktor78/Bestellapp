/**
 * Dynamically loads HTML content into elements with the attribute w3-include-html
 */
function includeHTML() {
  let elements = document.querySelectorAll("[w3-include-html]");

  elements.forEach(async (element) => {
    let file = element.getAttribute("w3-include-html");

    if (file) {
      let response = await fetch(file);
      if (response.ok) {
        let html = await response.text();
        element.innerHTML = html;
        element.removeAttribute("w3-include-html");

        let event = new CustomEvent("htmlIncluded", {
          detail: { element: element, file: file },
        });
        document.dispatchEvent(event);
      } else {
        element.innerHTML = `<p>Fehler beim Laden: ${file}</p>`;
      }
    }
  });
}

/**
 * Loads content into the main content container
 * @param {string} templatePath - The path to the template
 */
async function loadContentIntoMain(templatePath) {
  let contentContainer = document.getElementById("content");
  if (!contentContainer) {
    return;
  }

  let response = await fetch(templatePath);
  if (response.ok) {
    let html = await response.text();
    contentContainer.innerHTML = html;

    let event = new CustomEvent("contentLoaded", {
      detail: { template: templatePath },
    });
    document.dispatchEvent(event);
  } else {
    contentContainer.innerHTML = "<p>Fehler beim Laden des Inhalts.</p>";
  }
}

/**
 * Initializes event listeners for footer legal links
 */
function initFooterLegalLinks() {
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("legal_link")) {
      e.preventDefault();
      let linkText = e.target.textContent.trim();

      if (linkText === "Datenschutz") {
        loadContentIntoMain("templates/datenschutz-content.html");
      } else if (linkText === "Impressum") {
        loadContentIntoMain("templates/impressum-content.html");
      } else if (linkText === "AGB") {
        loadContentIntoMain("templates/agb-content.html");
      }
    }
  });
}

// Event Listener für Footer Links
document.addEventListener("DOMContentLoaded", () => {
  initFooterLegalLinks();
});

// Automatisch ausführen wenn DOM geladen ist
document.addEventListener("DOMContentLoaded", includeHTML);

// Export für Module (falls verwendet)
if (typeof module !== "undefined" && module.exports) {
  module.exports = { includeHTML };
}
