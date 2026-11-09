import { mountLayout, getBase } from "./layout.js";
import {
  ABOUT,
  CV,
  CONTACT,
  ICONS,
  SITE,
  UI,
  getVisibleProjects,
  getProjectViewModel,
} from "./content.js";
import { getLocale, setLocale, pickLocalized } from "./i18n.js";
import {
  renderProjectPanel,
  renderContactRow,
  renderCarousel,
  renderProjectSubnav,
  renderHighlights,
  renderTags,
  renderStoreBadges,
  renderCvCompetencyCards,
} from "./components.js";
import { resolveAssetPath } from "./assets.js";
import {
  initCvOverlay,
  refreshCvOverlayIfOpen,
  syncCvDownloads,
} from "./cv-overlay.js";
import { prefetchCvPdf } from "./cv-pdf.js";

function initMobileNav() {
  const toggle = document.querySelector(".site-nav__toggle");
  const nav = document.querySelector(".primary-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

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

function initCarousels() {
  document.querySelectorAll("[data-carousel]").forEach((root) => {
    const slides = [...root.querySelectorAll(".carousel__slide")];
    if (slides.length <= 1) return;

    let index = slides.findIndex((s) => s.classList.contains("is-active"));
    if (index < 0) index = 0;

    const dots = [...root.querySelectorAll(".carousel__dot")];

    const show = (next) => {
      index = (next + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        slide.classList.toggle("is-active", i === index);
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle("is-active", i === index);
      });
    };

    root.querySelector(".carousel__btn--prev")?.addEventListener("click", () => {
      show(index - 1);
    });
    root.querySelector(".carousel__btn--next")?.addEventListener("click", () => {
      show(index + 1);
    });
    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        show(Number(dot.dataset.index));
      });
    });
  });
}

function initProjectSubnav() {
  const subnav = document.querySelector("[data-project-subnav]");
  if (!subnav) return;

  const links = [...subnav.querySelectorAll("[data-subnav-link]")];
  const sections = links
    .map((link) => document.getElementById(link.dataset.subnavLink))
    .filter(Boolean);

  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const id = visible.target.id;
      links.forEach((link) => {
        link.classList.toggle("is-active", link.dataset.subnavLink === id);
      });
    },
    { rootMargin: "-40% 0px -45% 0px", threshold: [0, 0.25, 0.5] },
  );

  sections.forEach((section) => observer.observe(section));

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      document.getElementById(link.dataset.subnavLink)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      history.replaceState(null, "", `#${link.dataset.subnavLink}`);
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

  document.querySelectorAll('[data-i18n="site-title"]').forEach((el) => {
    el.textContent = pickLocalized(SITE.title, locale);
  });

  const nav = document.querySelector("#primary-nav-panel");
  if (nav) {
    nav.setAttribute("aria-label", pickLocalized(UI.mainNavAria, locale));
  }

  document.querySelectorAll("[data-lang-switch]").forEach((root) => {
    root.setAttribute("aria-label", pickLocalized(UI.langSwitchAria, locale));
  });

  const subnav = document.querySelector("[data-project-subnav]");
  if (subnav) {
    subnav.setAttribute("aria-label", pickLocalized(UI.projectSubnavAria, locale));
  }
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

function renderVikingCaseStudy() {
  const base = getBase();
  const locale = getLocale();
  const project = getProjectViewModel("viking", locale);
  if (!project) return;

  const subnavMount = document.querySelector("[data-viking-subnav]");
  if (subnavMount) {
    subnavMount.outerHTML = renderProjectSubnav(undefined, locale);
  }

  const carouselMount = document.querySelector("[data-viking-carousel]");
  if (carouselMount) {
    carouselMount.innerHTML = renderCarousel(
      project.caseStudyImages,
      base,
      "viking-carousel",
      locale,
    );
  }

  const tagsMount = document.querySelector("[data-viking-tags]");
  if (tagsMount) tagsMount.innerHTML = renderTags(project.tags);

  const storesMount = document.querySelector("[data-viking-stores]");
  if (storesMount) {
    storesMount.innerHTML = renderStoreBadges(project, base);
  }

  const highlightsMount = document.querySelector("[data-viking-highlights]");
  if (highlightsMount) {
    highlightsMount.innerHTML = renderHighlights(project.bullets);
  }
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
    initMobileNav();
    initLanguageSwitch();
    renderAboutPage();
    renderProjectsPage();
    renderCvPage();
    renderVikingCaseStudy();
    updateLocalizedUi();
    initCarousels();
    initProjectSubnav();
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

document.addEventListener("DOMContentLoaded", () => {
  setLocale(getLocale());
  initCvOverlay();
  refreshContent();
  requestAnimationFrame(() => {
    document.body.classList.add("is-content-ready");
  });
});
