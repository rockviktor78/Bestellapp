/**
 * Lädt HTML-Includes von externen Dateien asynchron
 * Ersetzt Elemente mit w3-include-html Attribut durch deren Inhalt
 */
async function includeHTML() {
  const includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    const file = element.getAttribute("w3-include-html");
    const resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }

  // Nach dem Laden der Templates die Links anpassen
  adjustTemplateLinks();
}
