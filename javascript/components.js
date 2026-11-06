import { resolveAssetPath } from "./assets.js";
import { ICONS } from "./content.js";
import { getLocale, pickLocalized } from "./i18n.js";

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function renderLangSwitch(base, locale, variant = "short") {
  const labels =
    variant === "long"
      ? { en: "English", sv: "Swedish" }
      : { en: "En", sv: "Sv" };
  return `
    <div class="lang-switch" data-lang-switch role="group" aria-label="Language">
      <button type="button" class="lang-switch__btn${locale === "en" ? " is-active" : ""}" data-lang="en">${labels.en}</button>
      <span class="lang-switch__sep">/</span>
      <button type="button" class="lang-switch__btn${locale === "sv" ? " is-active" : ""}" data-lang="sv">${labels.sv}</button>
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

export function renderStoreBadges(project, base) {
  const { stores } = project;
  if (!stores?.appStore && !stores?.playStore) return "";
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
    ? `<p class="project-panel__case"><a href="${caseHref}">${locale === "sv" ? "Case study" : "Case study"} →</a></p>`
    : "";

  return `
    <article class="project-panel" data-project="${escapeHtml(project.slug)}">
      <div class="project-panel__body">
        <div class="project-panel__copy">
          <header class="project-panel__head">
            <div class="project-panel__identity">
              <img class="project-panel__logo" src="${resolveAssetPath(base, project.logo)}" alt="" width="48" height="48" loading="lazy">
              <div class="project-panel__titles">
                <h2 class="project-panel__title">${escapeHtml(project.name)}</h2>
                <p class="project-panel__role">${escapeHtml(roleType)}</p>
              </div>
            </div>
            <p class="project-panel__period">${escapeHtml(project.period)}</p>
          </header>
          ${renderTags(project.tags, "tag-list tag-list--project")}
          <div class="project-panel__text-block">
            <p class="project-panel__description">${escapeHtml(description)}</p>
            ${bulletHtml}
          </div>
          ${caseLink}
        </div>
        <div class="project-panel__visual">
          <div class="project-panel__screenshot-wrap">
            <img class="project-panel__screenshot" src="${escapeHtml(screenshotSrc)}" ${screenshotSrcset ? `srcset="${screenshotSrcset}" sizes="(max-width: 899px) 100vw, min(22.375rem, 90vw)"` : ""} alt="${escapeHtml(project.name)} screenshots" width="358" height="277" loading="lazy" decoding="async">
          </div>
          ${renderStoreBadges(project, base)}
        </div>
      </div>
    </article>`;
}

export function renderHighlights(items) {
  if (!items?.length) return "";
  const lis = items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  return `<ul class="highlight-list">${lis}</ul>`;
}

export function renderCarousel(images, base, carouselId = "project-carousel") {
  const slides = images ?? [];
  if (!slides.length) {
    return `<p class="muted">Bilder kommer snart.</p>`;
  }

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
        `<button type="button" class="carousel__dot${index === 0 ? " is-active" : ""}" data-carousel-target="${carouselId}" data-index="${index}" aria-label="Bild ${index + 1}"></button>`,
    )
    .join("");

  return `
    <div class="carousel" id="${carouselId}" data-carousel>
      <div class="carousel__viewport">${slideHtml}</div>
      ${
        slides.length > 1
          ? `<div class="carousel__controls">
        <button type="button" class="carousel__btn carousel__btn--prev" data-carousel-target="${carouselId}" aria-label="Föregående">‹</button>
        <div class="carousel__dots">${dots}</div>
        <button type="button" class="carousel__btn carousel__btn--next" data-carousel-target="${carouselId}" aria-label="Nästa">›</button>
      </div>`
          : ""
      }
    </div>`;
}

export function renderProjectSubnav(sectionIds) {
  const items = [
    { id: "overview", label: "Overview" },
    { id: "contribution", label: "My contribution" },
    { id: "challenges", label: "Technical challenges" },
    { id: "architecture", label: "Architecture & implementation" },
    { id: "results", label: "Results & learnings" },
  ].filter((item) => !sectionIds || sectionIds.includes(item.id));

  const links = items
    .map(
      (item) =>
        `<a class="project-subnav__link" href="#${item.id}" data-subnav-link="${item.id}">${item.label}</a>`,
    )
    .join("");

  return `
    <nav class="project-subnav" aria-label="Projektsektioner" data-project-subnav>
      <div class="page-wrap project-subnav__inner">${links}</div>
    </nav>`;
}
