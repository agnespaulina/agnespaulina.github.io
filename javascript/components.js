import { resolveAssetPath } from "./assets.js";
import { ICONS } from "./content.js";
import { getLocale, pickLocalized } from "./i18n.js";
import { CASE_STUDY_SUBNAV, UI } from "./content.js";

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * @param {string} base
 * @param {string} locale
 * @param {"short" | "long" | { variant?: "short" | "long"; figma?: boolean }} variantOrOptions
 */
export function renderLangSwitch(base, locale, variantOrOptions = "short") {
  const options =
    typeof variantOrOptions === "string"
      ? { variant: variantOrOptions, figma: variantOrOptions === "long" }
      : {
          variant: variantOrOptions.variant ?? "short",
          figma: Boolean(variantOrOptions.figma),
        };
  const labels =
    options.variant === "long"
      ? { en: "English", sv: "Swedish" }
      : { en: "En", sv: "Sv" };
  const aria = pickLocalized(UI.langSwitchAria, locale);
  const mod = options.figma ? " lang-switch--figma" : "";
  return `
    <div class="lang-switch${mod}" data-lang-switch data-lang-switch-variant="${options.variant}" role="group" aria-label="${escapeHtml(aria)}">
      <button type="button" class="lang-switch__btn${locale === "en" ? " is-active" : ""}" data-lang="en">${labels.en}</button>
      <span class="lang-switch__sep">/</span>
      <button type="button" class="lang-switch__btn${locale === "sv" ? " is-active" : ""}" data-lang="sv">${labels.sv}</button>
    </div>`;
}

/** Figma header: språkrad med samma maxbredd och beteende på alla sidor. */
export function renderSiteLangChrome(base, locale) {
  return `
    <div class="site-chrome__lang site-chrome__lang--figma-after" data-component="site-lang">
      <div class="site-chrome__lang-inner">
        ${renderLangSwitch(base, locale, { variant: "long", figma: true })}
      </div>
    </div>`;
}

export function renderTags(tags, className = "tag-list") {
  if (!tags?.length) return "";
  const items = tags
    .map((tag) => `<li><span class="tag">${escapeHtml(tag)}</span></li>`)
    .join("");
  return `<ul class="${className}">${items}</ul>`;
}

export function renderSkillDots(level, max = 5) {
  const dots = [];
  for (let i = 1; i <= max; i += 1) {
    dots.push(
      `<span class="skill-dots__dot${i <= level ? " is-filled" : ""}" aria-hidden="true"></span>`,
    );
  }
  return `<span class="skill-dots" aria-label="${level} of ${max}">${dots.join("")}</span>`;
}

export function renderSkillRow(skill, base) {
  return `
    <li class="skill-row">
      <img class="skill-row__icon" src="${resolveAssetPath(base, skill.icon)}" alt="" width="40" height="40" loading="lazy">
      <span class="skill-row__name">${escapeHtml(skill.name)}</span>
      ${renderSkillDots(skill.level)}
    </li>`;
}

export function renderSkillColumns(skills, base) {
  const mid = Math.ceil(skills.length / 2);
  const left = skills.slice(0, mid);
  const right = skills.slice(mid);
  return `
    <div class="skill-columns">
      <ul class="skill-column">${left.map((s) => renderSkillRow(s, base)).join("")}</ul>
      <ul class="skill-column">${right.map((s) => renderSkillRow(s, base)).join("")}</ul>
    </div>`;
}

export function renderToolIcon(tool, base) {
  const src = resolveAssetPath(base, tool.icon);
  const isPdf = tool.icon.toLowerCase().endsWith(".pdf");
  const inner = isPdf
    ? `<object data="${src}" type="application/pdf" class="tool-icon__object" aria-label="${escapeHtml(tool.name)}"></object>`
    : `<img src="${src}" alt="${escapeHtml(tool.name)}" class="tool-icon__img" loading="lazy">`;
  return `<li class="tool-icon" title="${escapeHtml(tool.name)}">${inner}</li>`;
}

export function renderToolsRow(tools, base) {
  return `<ul class="tools-row">${tools.map((t) => renderToolIcon(t, base)).join("")}</ul>`;
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
  const parts = [];
  if (stores.playStore) {
    parts.push(
      `<a href="${stores.playStore}" rel="noopener noreferrer" class="store-badge">
        <img src="${resolveAssetPath(base, ICONS.googlePlay)}" alt="Google Play" width="120" height="36" loading="lazy">
      </a>`,
    );
  }
  if (stores.appStore) {
    parts.push(
      `<a href="${stores.appStore}" rel="noopener noreferrer" class="store-badge">
        <img src="${resolveAssetPath(base, ICONS.appStore)}" alt="App Store" width="120" height="36" loading="lazy">
      </a>`,
    );
  }
  if (stores.website) {
    const alt = escapeHtml(
      pickLocalized(stores.websiteLabel, locale) || "speedbox.eu",
    );
    const badgeSrc = stores.websiteBadge
      ? resolveAssetPath(base, stores.websiteBadge)
      : "";
    if (badgeSrc) {
      parts.push(
        `<a href="${escapeHtml(stores.website)}" rel="noopener noreferrer" class="store-badge">
          <img src="${escapeHtml(badgeSrc)}" alt="${alt}" width="120" height="36" loading="lazy">
        </a>`,
      );
    }
  }
  return `<div class="store-badges">${parts.join("")}</div>`;
}

export function renderProjectPanel(project, base, locale = getLocale()) {
  const description = pickLocalized(project.description, locale);
  const bullets = pickLocalized(project.bullets, locale);
  const roleType = pickLocalized(project.roleType, locale);
  const screenshotSrc = resolveAssetPath(base, project.screenshot);
  const screenshot2x =
    typeof project.screenshot2x === "string" && project.screenshot2x.length
      ? resolveAssetPath(base, project.screenshot2x)
      : "";
  const screenshotSrcset =
    screenshot2x && screenshot2x !== screenshotSrc
      ? `${escapeHtml(screenshot2x)} 2x`
      : "";
  const caseStudy = project.caseStudy;
  const caseHref =
    caseStudy?.href && caseStudy.linkVisible !== false
      ? `${base}${caseStudy.href}`
      : null;

  const bulletHtml = bullets.length
    ? `<ul class="project-panel__bullets">${bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>`
    : "";

  const caseLink = caseHref
    ? `<p class="project-panel__case"><a href="${caseHref}">${escapeHtml(pickLocalized(UI.caseStudyLink, locale))} →</a></p>`
    : "";

  const tagsHtml = renderTags(project.tags, "tag-list tag-list--project");
  const hasTags = Boolean(tagsHtml);
  const panelMods = hasTags ? "" : " project-panel--no-tags";

  return `
    <article class="project-panel${panelMods}" data-project="${escapeHtml(project.slug)}">
      <div class="project-panel__body">
        <header class="project-panel__head">
          <div class="project-panel__identity">
            <img class="project-panel__logo" src="${resolveAssetPath(base, project.logo)}" alt="" width="45" height="45" loading="lazy">
            <div class="project-panel__titles">
              <h2 class="project-panel__title">${escapeHtml(project.name)}</h2>
            </div>
          </div>
          <p class="project-panel__period">${escapeHtml(project.period)}</p>
        </header>
        <div class="project-panel__visual">
          <div class="project-panel__screenshot-wrap">
            <img class="project-panel__screenshot" src="${escapeHtml(screenshotSrc)}" ${screenshotSrcset ? `srcset="${screenshotSrcset}" sizes="(max-width: 899px) 100vw, min(22.375rem, 90vw)"` : ""} alt="${escapeHtml(project.name)} screenshots" width="358" height="277" loading="lazy" decoding="async">
          </div>
          ${renderStoreBadges(project, base)}
        </div>
        <p class="project-panel__role">${escapeHtml(roleType)}</p>
        ${hasTags ? `<div class="project-panel__tags">${tagsHtml}</div>` : ""}
        <div class="project-panel__copy">
          <div class="project-panel__text-block">
            <p class="project-panel__description">${escapeHtml(description)}</p>
            ${bulletHtml}
          </div>
          ${caseLink}
        </div>
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
        <span class="cv-area-card__glyph" aria-hidden="true">
          <img class="cv-area-card__glyph-icon" src="${iconSrc}" alt="" width="22" height="22" loading="lazy" decoding="async">
        </span>
        <h3 class="cv-area-card__title">${escapeHtml(title)}</h3>
        <p class="cv-area-card__text">${escapeHtml(description)}</p>
      </article>`;
    })
    .join("");
}

export function renderHighlights(items) {
  if (!items?.length) return "";
  const lis = items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  return `<ul class="highlight-list">${lis}</ul>`;
}

export function renderCarousel(
  images,
  base,
  carouselId = "project-carousel",
  locale = getLocale(),
) {
  const slides = images ?? [];
  if (!slides.length) {
    return `<p class="muted">${locale === "sv" ? "Bilder kommer snart." : "Images coming soon."}</p>`;
  }

  const slideWord = pickLocalized(UI.carouselSlideLabel, locale);

  const slideHtml = slides
    .map(
      (img, index) => `
      <figure class="carousel__slide${index === 0 ? " is-active" : ""}" data-index="${index}">
        <img src="${resolveAssetPath(base, img.src)}" alt="${escapeHtml(img.alt)}" loading="${index === 0 ? "eager" : "lazy"}">
      </figure>`,
    )
    .join("");

  const dots = slides
    .map(
      (_, index) =>
        `<button type="button" class="carousel__dot${index === 0 ? " is-active" : ""}" data-carousel-target="${carouselId}" data-index="${index}" aria-label="${escapeHtml(slideWord)} ${index + 1}"></button>`,
    )
    .join("");

  const prev = escapeHtml(pickLocalized(UI.carouselPrev, locale));
  const next = escapeHtml(pickLocalized(UI.carouselNext, locale));

  return `
    <div class="carousel" id="${carouselId}" data-carousel>
      <div class="carousel__viewport">${slideHtml}</div>
      ${
        slides.length > 1
          ? `<div class="carousel__controls">
        <button type="button" class="carousel__btn carousel__btn--prev" data-carousel-target="${carouselId}" aria-label="${prev}">‹</button>
        <div class="carousel__dots">${dots}</div>
        <button type="button" class="carousel__btn carousel__btn--next" data-carousel-target="${carouselId}" aria-label="${next}">›</button>
      </div>`
          : ""
      }
    </div>`;
}

export function renderProjectSubnav(sectionIds, locale = getLocale()) {
  const items = CASE_STUDY_SUBNAV.filter(
    (item) => !sectionIds || sectionIds.includes(item.id),
  );

  const links = items
    .map(
      (item) =>
        `<a class="project-subnav__link" href="#${item.id}" data-subnav-link="${item.id}">${escapeHtml(pickLocalized(item.label, locale))}</a>`,
    )
    .join("");

  const subnavAria = escapeHtml(pickLocalized(UI.projectSubnavAria, locale));

  return `
    <nav class="project-subnav" aria-label="${subnavAria}" data-project-subnav>
      <div class="page-wrap project-subnav__inner">${links}</div>
    </nav>`;
}
