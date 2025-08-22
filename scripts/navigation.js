/**
 * Behandelt die Navigation und passt Pfade basierend auf der aktuellen Position an
 * @param {string} targetPath - Ziel-Pfad
 * @returns {boolean} - Immer false, um default Link-Verhalten zu verhindern
 */
function handleNavigation(targetPath) {
  const currentPath = window.location.pathname;
  let adjustedPath = targetPath;

  // Wenn wir auf der index.html sind (Root-Ebene)
  if (currentPath.includes("index.html") || currentPath.endsWith("/")) {
    adjustedPath = targetPath.replace("../", "./");
  }

  window.location.href = adjustedPath;
  return false;
}

/**
 * Passt alle Links in Templates basierend auf der aktuellen Position an
 */
function adjustTemplateLinks() {
  const currentPath = window.location.pathname;
  const isRootLevel =
    currentPath.includes("index.html") || currentPath.endsWith("/");

  // Alle Links mit relativen Pfaden finden und anpassen
  const links = document.querySelectorAll('a[href^="../"]');
  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (isRootLevel) {
      link.setAttribute("href", href.replace("../", "./"));
    }
  });

  // Alle Bilder mit relativen Pfaden finden und anpassen
  const images = document.querySelectorAll('img[src^="../"]');
  images.forEach((img) => {
    const src = img.getAttribute("src");
    if (isRootLevel) {
      img.setAttribute("src", src.replace("../", "./"));
    }
  });
}
