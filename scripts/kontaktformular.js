/**
 * Initialisiert die Kontaktformular-Seite
 * Lädt HTML-Includes und rendert dynamischen Inhalt
 */
async function initKontaktformular() {
  await includeHTML();
  // Hier können weitere dynamische Inhalte gerendert werden
  console.log("Kontaktformular page initialized");
}

/**
 * Sendet das Kontaktformular
 * @param {Event} event - Das Submit-Event
 */
function sendMail(event) {
  event.preventDefault();
  // Hier die Email-Versand-Logik implementieren
  alert("Nachricht wurde gesendet!");
}
