import { resolveAssetPath } from "./assets.js";
import { ICONS, SITE, UI } from "./content.js";
import { getLocale, pickLocalized, pickLocalizedList } from "./i18n.js";

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function langSwitchButton(locale, lang, labels) {
  const isActive = locale === lang;
  return `<button type="button" class="lang-switch__btn${isActive ? " is-active" : ""}" data-lang="${lang}" aria-pressed="${isActive ? "true" : "false"}">
      <span class="lang-switch__label lang-switch__label--full">${escapeHtml(labels.full)}</span>
      <span class="lang-switch__label lang-switch__label--abbr">${escapeHtml(labels.abbr)}</span>
    </button>`;
}

/**
 * Language toggle. CSS switches full/abbr labels at the header breakpoint.
 */
export function renderLangSwitch(locale) {
  const aria = pickLocalized(UI.langSwitchAria, locale);
  return `
    <div class="lang-switch lang-switch--figma" data-lang-switch role="group" aria-label="${escapeHtml(aria)}">
      ${langSwitchButton(locale, "sv", SITE.lang.sv)}
      <span class="lang-switch__sep">/</span>
      ${langSwitchButton(locale, "en", SITE.lang.en)}
    </div>`;
}

function renderHeaderTabs(active, locale, resolveHref) {
  const items = [
    { id: "about", ...SITE.nav.about },
    { id: "projects", ...SITE.nav.projects },
    { id: "cv", ...SITE.nav.cv },
  ];

  return items
    .map((item) => {
      const label = pickLocalized(item, locale);
      const isActive = active === item.id;
      return `
        <a class="web-page-header__tab${isActive ? " is-active" : ""}"
           href="${resolveHref(item.href)}"
           ${isActive ? 'aria-current="page"' : ""}>
          <span class="web-page-header__tab-label">${escapeHtml(label)}</span>
          <span class="web-page-header__tab-indicator" aria-hidden="true"></span>
        </a>`;
    })
    .join("");
}

/**
 * Shared site header (Figma `web-page-header`). Used on every themed HTML page.
 * Copy and links come from `SITE` in content.js.
 */
export function renderWebPageHeader({ base, locale, active, resolveHref }) {
  const title = pickLocalized(SITE.title, locale);
  const emailLabel = pickLocalized(SITE.nav.email, locale);
  const [firstName, ...restName] = SITE.name.split(" ");
  const lastName = restName.join(" ");
  const emailHref = SITE.nav.email.href;

  return `
    <header class="web-page-header site-chrome site-chrome--figma" data-component="site-header">
      <div class="web-page-header__band">
        <div class="web-page-header__inner">
          <div class="web-page-header__title-row">
            <div class="web-page-header__brand">
              <a class="web-page-header__brand-link" href="${resolveHref("about.html")}">
                <span class="web-page-header__name">
                  <span class="web-page-header__name-part">${escapeHtml(firstName)}</span>
                  <span class="web-page-header__name-part">${escapeHtml(lastName)}</span>
                </span>
                <span class="web-page-header__role" data-i18n="site-title">${escapeHtml(title)}</span>
              </a>
            </div>
            <div class="web-page-header__lead">
              <a class="web-page-header__email" href="${emailHref}" aria-label="${escapeHtml(emailLabel)}">
                <img class="web-page-header__email-icon" src="${resolveAssetPath(base, ICONS.email)}" alt="" width="22" height="22">
                <span class="web-page-header__email-label">${escapeHtml(emailLabel)}</span>
              </a>
            </div>
          </div>
          <div class="web-page-header__nav-row">
            <nav id="primary-nav-panel" class="web-page-header__tabs" aria-label="${escapeHtml(pickLocalized(UI.mainNavAria, locale))}">
              ${renderHeaderTabs(active, locale, resolveHref)}
            </nav>
            <div class="web-page-header__trailing">
              ${renderLangSwitch(locale)}
            </div>
          </div>
        </div>
      </div>
    </header>`;
}

export function renderTags(tags, className = "tag-list", locale = getLocale()) {
  if (!tags?.length) return "";
  const items = tags
    .map(
      (tag) =>
        `<li><span class="tag">${escapeHtml(pickLocalized(tag, locale))}</span></li>`,
    )
    .join("");
  return `<ul class="${className}">${items}</ul>`;
}

export function renderContactRow(contact, base) {
  return `
    <div class="contact-row" id="contact">
      <a class="contact-item" href="${contact.phoneHref}">
        <img src="${resolveAssetPath(base, ICONS.phone)}" alt="" width="22" height="22">
        <span>${escapeHtml(contact.phone)}</span>
      </a>
      <a class="contact-item" href="${contact.emailHref}">
        <img src="${resolveAssetPath(base, ICONS.email)}" alt="" width="22" height="22">
        <span>${escapeHtml(contact.email)}</span>
      </a>
      <a class="contact-item contact-item--linkedin" href="${contact.linkedInUrl}" rel="noopener noreferrer" target="_blank">
        <img src="${resolveAssetPath(base, ICONS.linkedIn)}" alt="" width="22" height="22">
        <span>${escapeHtml(contact.linkedInHandle)}</span>
      </a>
    </div>`;
}

export function renderStoreBadges(project, base, locale = getLocale()) {
  const { stores } = project;
  if (!stores?.appStore && !stores?.playStore && !stores?.website) return "";
  const badge = (href, icon, alt) =>
    `<a href="${escapeHtml(href)}" rel="noopener noreferrer" target="_blank" class="store-badge">
        <img src="${resolveAssetPath(base, icon)}" alt="${escapeHtml(alt)}" height="40" loading="lazy">
      </a>`;
  const parts = [];
  if (stores.appStore) parts.push(badge(stores.appStore, ICONS.appStore, "App Store"));
  if (stores.playStore) parts.push(badge(stores.playStore, ICONS.googlePlay, "Google Play"));
  if (stores.website) {
    const label = pickLocalized(stores.websiteLabel, locale) || stores.website;
    parts.push(
      `<a href="${escapeHtml(stores.website)}" rel="noopener noreferrer" target="_blank" class="btn btn--solid">${escapeHtml(label)}</a>`,
    );
  }
  return `<div class="store-badges">${parts.join("")}</div>`;
}

/** One project card. Layout (mobile/desktop) is handled purely by CSS grid areas. */
export function renderProjectPanel(project, base, locale = getLocale()) {
  const rawDescription = pickLocalized(project.description, locale);
  const paragraphs = Array.isArray(rawDescription)
    ? rawDescription
    : [rawDescription];
  const bullets = pickLocalizedList(project.bullets, locale);
  const tagsHtml = renderTags(project.tags, "tag-list tag-list--project", locale);

  return `
    <article class="project-card" data-project="${escapeHtml(project.slug)}">
      <header class="project-card__head">
        <img class="project-card__logo" src="${resolveAssetPath(base, project.logo)}" alt="" width="45" height="45" loading="lazy">
        <div class="project-card__titles">
          <h2 class="project-card__title">${escapeHtml(project.name)}</h2>
          <p class="project-card__period">${escapeHtml(pickLocalized(project.period, locale))}</p>
        </div>
      </header>
      <p class="project-card__role">${escapeHtml(pickLocalized(project.roleType, locale))}</p>
      ${tagsHtml ? `<div class="project-card__tags">${tagsHtml}</div>` : ""}
      <div class="project-card__visual">
        <img class="project-card__screenshot" src="${escapeHtml(resolveAssetPath(base, project.screenshot))}" alt="${escapeHtml(project.name)}" width="358" height="277" loading="lazy" decoding="async">
        ${renderStoreBadges(project, base, locale)}
      </div>
      <div class="project-card__copy">
        ${paragraphs.map((t) => `<p>${escapeHtml(t)}</p>`).join("")}
        ${bullets.length ? `<ul class="project-card__bullets">${bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>` : ""}
      </div>
    </article>`;
}

export function renderCvCompetencyCards(areas, base, locale = getLocale()) {
  if (!areas?.length) return "";
  return areas
    .map((item) => {
      const title = pickLocalized(item.title, locale);
      const description = pickLocalized(item.description, locale);
      const iconSrc = resolveAssetPath(base, item.icon);
      return `<article class="cv-area-card">
        <div class="cv-area-card__head">
          <span class="cv-area-card__glyph" style="--glyph:url('${iconSrc}')" aria-hidden="true"></span>
          <h3 class="cv-area-card__title">${escapeHtml(title)}</h3>
        </div>
        <p class="cv-area-card__text">${escapeHtml(description)}</p>
      </article>`;
    })
    .join("");
}
