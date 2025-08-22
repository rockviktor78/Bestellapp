# Copilot Projekt-Instructions

## Projekt-Konventionen

- Für DOM-Zugriffe in allen JavaScript Dateien immer `getElementById` verwenden. Keinen `querySelector` oder `getElementsByClassName` verwenden.
- Für Styling in CSS immer Klassen (`.css`) benutzen.
- Für JavaScript-Selektoren immer IDs (`id="..."`) im HTML verwenden.
- IDs sind ausschließlich für JavaScript-Zugriffe reserviert.
- Klassen sind ausschließlich für CSS-Styles reserviert.

## JavaScript-Funktionsrichtlinien

- Jede Funktion darf maximal 14 Zeilen lang sein (inklusive öffnender und schließender geschweifte Klammern)
- Jede Funktion soll nur eine einzige, klar definierte Aufgabe erfüllen
- Komplexe Funktionen in kleinere Hilfsfunktionen aufteilen
- Keine verschachtelten Funktionen verwenden
- Bei Überschreitung der Zeilenbegrenzung: Funktion in mehrere spezialisierte Funktionen aufteilen

## JSDoc-Anforderungen

- Alle JavaScript-Funktionen müssen JSDoc-Kommentare auf Deutsch haben
- JSDoc-Format verwenden: `/** */`
- Kurze, prägnante Beschreibung der Funktionsaufgabe
- Parameter mit `@param {type} name - Beschreibung` dokumentieren
- Rückgabewerte mit `@returns {type} Beschreibung` dokumentieren
- Deutsche Beschreibungen und Parameter-Erklärungen verwenden

## Beispiel

```html
<div id="meinElement" class="mein-style"></div>
```

```css
.mein-style {
  /* Style-Regeln */
}
```

```javascript
/**
 * Ändert die Sichtbarkeit eines Elements
 * @param {string} elementId - ID des HTML-Elements
 */
function toggleElement(elementId) {
  const element = document.getElementById(elementId);
  if (element.style.display === "none") {
    element.style.display = "block";
  } else {
    element.style.display = "none";
  }
}
```
