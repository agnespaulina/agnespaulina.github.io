import { mountLayout, getBase } from "./layout.js";
import {
  ABOUT,
  CV,
  CONTACT,
  ICONS,
  SITE,
  UI,
  getVisibleProjects,
} from "./content.js";
import { getLocale, setLocale, pickLocalized } from "./i18n.js";
import {
  renderProjectPanel,
  renderContactRow,
  renderCvCompetencyCards,
} from "./components.js";
import { resolveAssetPath } from "./assets.js";
import {
  initCvOverlay,
  refreshCvOverlayIfOpen,
  syncCvDownloads,
} from "./cv-overlay.js";
import { prefetchCvPdf } from "./cv-pdf.js";

function initLanguageSwitch() {
  document.querySelectorAll("[data-lang-switch]").forEach((root) => {
    root.querySelectorAll("[data-lang]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const next = btn.dataset.lang;
        if (next === getLocale()) return;
        setLocale(next);
        document.querySelectorAll("[data-lang-switch]").forEach((group) => {
          group.querySelectorAll("[data-lang]").forEach((peer) => {
            peer.classList.toggle("is-active", peer.dataset.lang === next);
          });
        });
        refreshContent({ animate: true });
      });
    });
  });
}

function updateLocalizedUi() {
  const locale = getLocale();
  const page = document.body?.dataset?.page;

  const skip = document.querySelector('.visually-hidden[href="#main"]');
  if (skip) {
    skip.textContent = pickLocalized(UI.skipToContent, locale);
  }

  if (page && UI.pageTitle[page]) {
    document.title = `${pickLocalized(UI.pageTitle[page], locale)} | ${SITE.name}`;
  }

  const nav = document.querySelector("#primary-nav-panel");
  if (nav) {
    nav.setAttribute("aria-label", pickLocalized(UI.mainNavAria, locale));
  }

  document.querySelectorAll("[data-lang-switch]").forEach((root) => {
    root.setAttribute("aria-label", pickLocalized(UI.langSwitchAria, locale));
  });
}

function renderAboutPage() {
  const locale = getLocale();
  const base = getBase();

  const bioMount = document.querySelector("[data-about-bio]");
  if (bioMount) {
    const paragraphs = pickLocalized(ABOUT.bio, locale);
    const bioHtml = paragraphs
      .map((p) => `<p>${escapeHtml(p)}</p>`)
      .join("");
    bioMount.innerHTML = bioHtml;
  }

  const profileImg = document.querySelector("[data-about-profile-image]");
  if (profileImg) {
    profileImg.src = resolveAssetPath(base, ABOUT.profileImage);
  }

  const bioHeading = document.querySelector("[data-about-bio-heading]");
  if (bioHeading) {
    bioHeading.textContent = pickLocalized(ABOUT.bioHeading, locale);
  }

  const contactHeading = document.querySelector("[data-about-contact-heading]");
  if (contactHeading) {
    contactHeading.textContent = pickLocalized(ABOUT.contactHeading, locale);
  }

  const contactMount = document.querySelector("[data-about-contact]");
  if (contactMount) {
    contactMount.innerHTML = renderContactRow(CONTACT, base);
  }
}

function renderProjectsPage() {
  const mount = document.querySelector("[data-projects-list]");
  if (!mount) return;
  const base = getBase();
  const locale = getLocale();
  mount.innerHTML = getVisibleProjects()
    .map((p) => renderProjectPanel(p, base, locale))
    .join("");
  // Re-measure the cards (clip variables) after every render.
  requestAnimationFrame(() => window.dispatchEvent(new Event("resize")));

  // Mobile: mark the project header that is currently pinned (styles the card edge + top cover).
  if (!mount.dataset.stuckBound) {
    mount.dataset.stuckBound = "true";
    const heads = () => mount.querySelectorAll(".project-card__head");
    // The pinned header's position is computed from the card (never read from the sticky
    // element itself): iOS moves sticky elements on the compositor, so their measured
    // position can lag behind what is on screen.
    // Resolve --stick-top (a calc() with env()) to pixels via a probe; reading the computed
    // `top` of the sticky element can return an unresolved calc() string in Safari.
    const probe = document.createElement("div");
    probe.setAttribute("aria-hidden", "true");
    probe.style.cssText =
      "position:fixed;left:0;width:0;height:0;visibility:hidden;pointer-events:none;top:var(--stick-top,0px)";
    document.body.appendChild(probe);
    const update = () => {
      const mobile = !window.matchMedia("(min-width: 900px)").matches;
      heads().forEach((head) => {
        const card = head.closest(".project-card");
        const stickTop = probe.getBoundingClientRect().top;
        const rect = card.getBoundingClientRect();
        const cs = getComputedStyle(card);
        const contentBottom =
          rect.bottom -
          (parseFloat(cs.borderBottomWidth) || 0) -
          (parseFloat(cs.paddingBottom) || 0);
        card.style.setProperty("--card-h", `${rect.height}px`);
        card.style.setProperty("--head-h", `${head.offsetHeight}px`);
        card.style.setProperty(
          "--body-h",
          `${card.querySelector(".project-card__body")?.offsetHeight ?? 0}px`,
        );
        const headTop = Math.min(stickTop, contentBottom - head.offsetHeight);
        const stuck = mobile && rect.top + 1.5 < headTop;
        head.classList.toggle("is-stuck", stuck);
      });
    };
    const schedule = update;
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("load", schedule);
    update();
  }

  // Mobile: tapping the pinned project header scrolls back to the top of that card.
  if (!mount.dataset.scrollTopBound) {
    mount.dataset.scrollTopBound = "true";
    mount.addEventListener("click", (event) => {
      const head = event.target.closest(".project-card__head");
      if (!head || window.matchMedia("(min-width: 900px)").matches) return;
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      head.closest(".project-card")?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
    });
  }
}

function renderCvPage() {
  const locale = getLocale();
  const base = getBase();
  const areasHeading = document.querySelector("[data-cv-areas-heading]");
  const areasGrid = document.querySelector("[data-cv-areas-grid]");
  const resumeHeading = document.querySelector("[data-cv-resume-heading]");
  const resumeIntro = document.querySelector("[data-cv-resume-intro]");
  const thumbnailBtn = document.querySelector("[data-cv-thumbnail]");
  const thumbnailMount = document.querySelector("[data-cv-thumbnail-mount]");
  const downloadIcon = document.querySelector("[data-cv-download-icon]");
  const pdfPath = CV.preview[locale] ?? CV.preview.sv;

  if (areasHeading) {
    areasHeading.textContent = pickLocalized(CV.areasHeading, locale);
  }
  if (areasGrid) {
    areasGrid.innerHTML = renderCvCompetencyCards(CV.competencyAreas, base, locale);
  }
  if (resumeHeading) {
    resumeHeading.textContent = pickLocalized(CV.resumeHeading, locale);
  }
  if (resumeIntro) {
    resumeIntro.textContent = pickLocalized(CV.resumeIntro, locale);
  }
  const viewLabel = pickLocalized(CV.viewCvLabel, locale);
  if (thumbnailBtn) {
    thumbnailBtn.setAttribute("aria-label", viewLabel);
  }
  if (thumbnailMount) {
    const img = document.createElement("img");
    img.className = "cv-resume__thumbnail-img";
    img.src = resolveAssetPath(base, CV.thumbnail[locale] ?? CV.thumbnail.sv);
    img.alt = "";
    img.width = 1150;
    img.height = 1628;
    img.decoding = "async";
    thumbnailMount.replaceChildren(img);
  }
  if (thumbnailBtn) {
    const warm = () => prefetchCvPdf(resolveAssetPath(base, pdfPath));
    thumbnailBtn.onpointerenter = warm;
    thumbnailBtn.onfocus = warm;
    thumbnailBtn.ontouchstart = warm;
  }

  syncCvDownloads(base, locale);
  if (downloadIcon) {
    downloadIcon.src = resolveAssetPath(base, ICONS.download);
  }
  refreshCvOverlayIfOpen();
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function refreshContent({ animate = false } = {}) {
  const apply = () => {
    mountLayout();
    initLanguageSwitch();
    renderAboutPage();
    renderProjectsPage();
    renderCvPage();
    updateLocalizedUi();
  };

  const main = document.querySelector(".page-main");
  if (animate && main && typeof document.startViewTransition === "function") {
    main.classList.add("is-view-transitioning");
    const transition = document.startViewTransition(apply);
    transition.finished.finally(() => {
      main.classList.remove("is-view-transitioning");
    });
    return;
  }

  apply();
}

/**
 * Keep the browser's status-bar tint in step with what is actually at the top of the screen:
 * the header band's colour while the band is there, the page colour once it has scrolled away.
 * (Safari does not reliably restore the tint by itself after scrolling back to the top.)
 */
function initChromeTint() {
  const band = document.querySelector(".web-page-header__band");
  if (!band) return;
  const bandColor =
    getComputedStyle(document.body).getPropertyValue("--color-figma-band").trim() ||
    "#e9e9e9";
  const pageColor = "#ffffff";
  const metas = document.querySelectorAll('meta[name="theme-color"]');
  let current = "";
  const apply = () => {
    const bandVisible = band.getBoundingClientRect().bottom > 1;
    const color = bandVisible ? bandColor : pageColor;
    if (color === current) return;
    current = color;
    document.documentElement.style.backgroundColor = color;
    metas.forEach((m) => m.setAttribute("content", color));
  };
  window.addEventListener("scroll", apply, { passive: true });
  window.addEventListener("resize", apply);
  window.addEventListener("pageshow", apply);
  apply();
}

document.addEventListener("DOMContentLoaded", () => {
  setLocale(getLocale());
  initCvOverlay();
  refreshContent();
  initChromeTint();
  requestAnimationFrame(() => {
    document.body.classList.add("is-content-ready");
  });
});
