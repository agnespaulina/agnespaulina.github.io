import { SITE, CONTACT, ICONS, UI } from "./content.js";
import { resolveAssetPath } from "./assets.js";
import { getLocale, pickLocalized } from "./i18n.js";
import { renderLangSwitch, renderWebPageHeader, renderContactRow } from "./components.js";

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
  if (page === "project-viking") return "projects";
  if (page) return page;
  const path = window.location.pathname;
  const file = path.split("/").pop() || "index.html";
  if (path.includes("/projects/")) return "projects";
  if (file === "index.html" || file === "" || file === "about.html") return "about";
  if (file === "projects.html") return "projects";
  if (file === "cv.html") return "cv";
  return "";
}

function renderPrimaryNav(active, locale, base) {
  const items = [
    { id: "about", ...SITE.nav.about },
    { id: "projects", ...SITE.nav.projects },
    { id: "cv", ...SITE.nav.cv },
    { id: "email", ...SITE.nav.email, external: true },
  ];

  return items
    .map((item) => {
      const label = pickLocalized(item, locale);
      const isActive = active === item.id;
      const href = item.href.startsWith("mailto:")
        ? item.href
        : resolveHref(item.href);
      const isEmail = item.id === "email";
      const emailIcon = `<img class="primary-nav__email-icon" src="${resolveAssetPath(base, ICONS.email)}" alt="" width="22" height="22">`;
      const inner = isEmail
        ? `<span class="primary-nav__email-inner">${emailIcon}<span class="primary-nav__email-label">${escapeHtml(label)}</span></span>`
        : escapeHtml(label);
      return `
        <a class="primary-nav__link${isActive ? " is-active" : ""}${isEmail ? " primary-nav__link--email" : ""}"
           href="${href}"
           ${isActive ? 'aria-current="page"' : ""}
           ${item.external && !isEmail ? 'rel="noopener"' : ""}>
          ${inner}
        </a>`;
    })
    .join("");
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

function renderDefaultChrome() {
  const base = getBase();
  const locale = getLocale();
  const active = currentPageId();
  const title = pickLocalized(SITE.title, locale);

  return `
    <header class="site-chrome" data-component="site-header">
      <div class="page-wrap site-chrome__top">
        <div class="site-brand">
          <a class="site-brand__link" href="${resolveHref("about.html")}">
            <span class="site-brand__name">${escapeHtml(SITE.name)}</span>
            <span class="site-brand__title" data-i18n="site-title">${escapeHtml(title)}</span>
          </a>
        </div>
        <div class="site-chrome__lang">${renderLangSwitch(base, locale, "short")}</div>
        <button type="button" class="site-nav__toggle" aria-expanded="false" aria-controls="primary-nav-panel">
          <span class="visually-hidden">Meny</span>
          <span class="site-nav__toggle-bar" aria-hidden="true"></span>
          <span class="site-nav__toggle-bar" aria-hidden="true"></span>
        </button>
      </div>
      <nav id="primary-nav-panel" class="primary-nav page-wrap" aria-label="${escapeHtml(pickLocalized(UI.mainNavAria, locale))}">
        ${renderPrimaryNav(active, locale, base)}
      </nav>
    </header>`;
}

function renderSiteChrome() {
  return document.body?.classList?.contains("site-theme-figma")
    ? renderFigmaChrome()
    : renderDefaultChrome();
}

function renderSiteFooter() {
  const locale = getLocale();
  const base = getBase();
  const year = new Date().getFullYear();
  const showLangInFooter = !document.body?.classList?.contains("site-theme-figma");

  return `
    <footer class="site-footer" data-component="site-footer">
      <div class="page-wrap site-footer__inner">
        ${currentPageId() !== "about" ? renderContactRow(CONTACT, base) : ""}
        <p class="site-footer__copy">© ${year} ${escapeHtml(SITE.name)}</p>
        ${showLangInFooter ? renderLangSwitch(base, locale, "short") : ""}
      </div>
    </footer>`;
}

export function mountLayout() {
  document.querySelectorAll("[data-component='site-header']").forEach((el) => {
    el.outerHTML = renderSiteChrome();
  });
  document.querySelectorAll("[data-component='site-footer']").forEach((el) => {
    el.outerHTML = renderSiteFooter();
  });
}

export { getBase, resolveHref, CONTACT };
