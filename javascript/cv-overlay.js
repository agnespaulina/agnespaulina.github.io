import { CV } from "./content.js";
import { resolveAssetPath } from "./assets.js";
import { getLocale, pickLocalized } from "./i18n.js";
import { renderCvPdfInline, cancelCvPdfRender } from "./cv-pdf.js";

let scrollLockY = 0;
let lastFocusEl = null;
let keydownHandler = null;

function getBase() {
  return document.documentElement.dataset.base ?? "./";
}

function lockPageScroll() {
  scrollLockY = window.scrollY;
  document.body.classList.add("cv-overlay-open");
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollLockY}px`;
  document.body.style.width = "100%";
}

function unlockPageScroll() {
  document.body.classList.remove("cv-overlay-open");
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.width = "";
  window.scrollTo(0, scrollLockY);
}

function getOverlayEls() {
  return {
    root: document.querySelector("[data-cv-overlay]"),
    backdrop: document.querySelector("[data-cv-overlay-backdrop]"),
    dialog: document.querySelector("[data-cv-overlay-dialog]"),
    title: document.querySelector("[data-cv-overlay-title]"),
    close: document.querySelector("[data-cv-overlay-close]"),
    download: document.querySelector("[data-cv-overlay-download]"),
    viewer: document.querySelector("[data-cv-overlay-viewer]"),
    openTab: document.querySelector("[data-cv-overlay-open-tab]"),
  };
}

function filePathFromLocale(locale) {
  return CV.files[locale] ?? CV.files.sv;
}

export function syncCvDownloads(base, locale) {
  const resolved = resolveAssetPath(base, filePathFromLocale(locale));
  const downloadLabel = pickLocalized(CV.downloadLabel, locale);

  document.querySelectorAll("[data-cv-download]").forEach((el) => {
    el.href = resolved;
    el.setAttribute("download", "");
    el.setAttribute("aria-label", downloadLabel);
    const label = el.querySelector("[data-cv-download-label]");
    if (label) label.textContent = downloadLabel;
    else if (!el.querySelector("img")) {
      el.textContent = downloadLabel;
    }
  });
}

function updateOverlayCopy(locale) {
  const { title, close, download, openTab } = getOverlayEls();
  const base = getBase();
  const resolved = resolveAssetPath(base, filePathFromLocale(locale));

  if (title) {
    title.textContent = pickLocalized(CV.resumeHeading, locale);
  }
  if (close) {
    close.setAttribute("aria-label", pickLocalized(CV.overlayCloseAria, locale));
  }
  if (download) {
    download.href = resolved;
    download.setAttribute("download", "");
    download.setAttribute("aria-label", pickLocalized(CV.downloadLabel, locale));
  }
  if (openTab) {
    openTab.textContent = pickLocalized(CV.openPdfInTab, locale);
    openTab.href = resolved;
  }

  syncCvDownloads(base, locale);
}

function trapFocus(dialog, closeBtn) {
  const focusable = dialog.querySelectorAll(
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
  );
  const first = focusable[0] ?? closeBtn;
  const last = focusable[focusable.length - 1] ?? closeBtn;

  keydownHandler = (event) => {
    if (event.key === "Escape") {
      closeCvOverlay();
      return;
    }
    if (event.key !== "Tab") return;
    if (event.shiftKey) {
      if (document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
    } else if (document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };
  document.addEventListener("keydown", keydownHandler);
  closeBtn?.focus();
}

function releaseFocus() {
  if (keydownHandler) {
    document.removeEventListener("keydown", keydownHandler);
    keydownHandler = null;
  }
  lastFocusEl?.focus();
  lastFocusEl = null;
}

export function openCvOverlay(trigger) {
  const locale = getLocale();
  const base = getBase();
  const { root, backdrop, dialog, viewer, close } = getOverlayEls();
  if (!root || !viewer) return;

  lastFocusEl = trigger ?? document.activeElement;
  updateOverlayCopy(locale);

  const pdfPath = CV.preview[locale] ?? CV.preview.sv;
  renderCvPdfInline(viewer, resolveAssetPath(base, pdfPath), {
    loadingText: pickLocalized(CV.pdfLoading, locale),
    errorText: pickLocalized(CV.pdfError, locale),
    errorOpenLabel: pickLocalized(CV.openPdfInTab, locale),
    errorOpenHref: resolveAssetPath(base, filePathFromLocale(locale)),
  });

  root.hidden = false;
  root.setAttribute("aria-hidden", "false");
  lockPageScroll();
  trapFocus(dialog, close);
}

export function closeCvOverlay() {
  const { root, viewer } = getOverlayEls();
  if (!root || root.hidden) return;

  cancelCvPdfRender();
  viewer?.replaceChildren();
  root.hidden = true;
  root.setAttribute("aria-hidden", "true");
  unlockPageScroll();
  releaseFocus();
}

export function refreshCvOverlayIfOpen() {
  const { root, viewer } = getOverlayEls();
  if (!root || root.hidden) return;
  const locale = getLocale();
  const base = getBase();
  updateOverlayCopy(locale);
  const pdfPath = CV.preview[locale] ?? CV.preview.sv;
  renderCvPdfInline(viewer, resolveAssetPath(base, pdfPath), {
    loadingText: pickLocalized(CV.pdfLoading, locale),
    errorText: pickLocalized(CV.pdfError, locale),
    errorOpenLabel: pickLocalized(CV.openPdfInTab, locale),
    errorOpenHref: resolveAssetPath(base, filePathFromLocale(locale)),
  });
}

let overlayInitialized = false;

export function initCvOverlay() {
  if (overlayInitialized) return;
  overlayInitialized = true;

  const { backdrop, close } = getOverlayEls();
  const thumbnailBtn = document.querySelector("[data-cv-thumbnail]");

  thumbnailBtn?.addEventListener("click", () => openCvOverlay(thumbnailBtn));
  close?.addEventListener("click", () => closeCvOverlay());
  backdrop?.addEventListener("click", () => closeCvOverlay());
}
