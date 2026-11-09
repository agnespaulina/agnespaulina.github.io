import { SITE, CONTACT } from "./content.js";
import { getLocale } from "./i18n.js";
import { renderWebPageHeader, renderContactRow } from "./components.js";

function getBase() {
  return document.documentElement.dataset.base ?? "./";
}

function resolveHref(href) {
  const base = getBase();
  if (href.startsWith("http") || href.startsWith("#") || href.startsWith("mailto:")) {
    return href;
  }
  return `${base}${href}`;
}

function currentPageId() {
  const page = document.body.dataset.page;
  if (page) return page;
  const path = window.location.pathname;
  const file = path.split("/").pop() || "index.html";
  if (file === "index.html" || file === "" || file === "about.html") return "about";
  if (file === "projects.html") return "projects";
  if (file === "cv.html") return "cv";
  return "";
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderFigmaChrome() {
  return renderWebPageHeader({
    base: getBase(),
    locale: getLocale(),
    active: currentPageId(),
    resolveHref,
  });
}

function renderSiteFooter() {
  const locale = getLocale();
  const base = getBase();
  const year = new Date().getFullYear();

  return `
    <footer class="site-footer" data-component="site-footer">
      <div class="page-wrap site-footer__inner">
        ${currentPageId() !== "about" ? renderContactRow(CONTACT, base) : ""}
        <p class="site-footer__copy">© ${year} ${escapeHtml(SITE.name)}</p>
      </div>
    </footer>`;
}

export function mountLayout() {
  document.querySelectorAll("[data-component='site-header']").forEach((el) => {
    el.outerHTML = renderFigmaChrome();
  });
  document.querySelectorAll("[data-component='site-footer']").forEach((el) => {
    el.outerHTML = renderSiteFooter();
  });
}

export { getBase, resolveHref, CONTACT };
