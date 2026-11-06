import { mountLayout, getBase } from "./layout.js";
import {
  ABOUT,
  CV,
  CONTACT,
  getVisibleProjects,
  getProjectViewModel,
} from "./content.js";
import { getLocale, setLocale, pickLocalized } from "./i18n.js";
import {
  renderProjectPanel,
  renderSkillColumns,
  renderToolsRow,
  renderContactRow,
  renderCarousel,
  renderProjectSubnav,
  renderHighlights,
  renderTags,
  renderStoreBadges,
} from "./components.js";
import { resolveAssetPath } from "./assets.js";

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
        setLocale(btn.dataset.lang);
        refreshContent();
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

  const contactHeading = document.querySelector("[data-about-contact-heading]");
  if (contactHeading) {
    contactHeading.textContent = pickLocalized(ABOUT.contactHeading, locale);
  }

  const contactMount = document.querySelector("[data-about-contact]");
  if (contactMount) {
    contactMount.innerHTML = renderContactRow(CONTACT, base);
  }

  const skillsHeading = document.querySelector("[data-about-skills-heading]");
  if (skillsHeading) {
    skillsHeading.textContent = pickLocalized(ABOUT.skillsHeading, locale);
  }

  const skillsMount = document.querySelector("[data-about-skills]");
  if (skillsMount) {
    skillsMount.innerHTML = renderSkillColumns(ABOUT.skills, base);
  }

  const toolsHeading = document.querySelector("[data-about-tools-heading]");
  if (toolsHeading) {
    toolsHeading.textContent = pickLocalized(ABOUT.toolsHeading, locale);
  }

  const toolsMount = document.querySelector("[data-about-tools]");
  if (toolsMount) {
    toolsMount.innerHTML = renderToolsRow(ABOUT.tools, base);
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
}

function renderCvPage() {
  const locale = getLocale();
  const base = getBase();
  const preview = document.querySelector("[data-cv-preview]");
  const download = document.querySelector("[data-cv-download]");
  const label = document.querySelector("[data-cv-download-label]");

  const pdfPath = CV.preview[locale] ?? CV.preview.sv;
  const filePath = CV.files[locale] ?? CV.files.sv;

  if (preview) {
    preview.src = resolveAssetPath(base, pdfPath);
  }
  if (download) {
    download.href = resolveAssetPath(base, filePath);
    download.setAttribute("download", "");
  }
  if (label) {
    label.textContent = pickLocalized(CV.downloadLabel, locale);
  }
}

function renderVikingCaseStudy() {
  const base = getBase();
  const locale = getLocale();
  const project = getProjectViewModel("viking", locale);
  if (!project) return;

  const subnavMount = document.querySelector("[data-viking-subnav]");
  if (subnavMount) {
    subnavMount.outerHTML = renderProjectSubnav();
  }

  const carouselMount = document.querySelector("[data-viking-carousel]");
  if (carouselMount) {
    carouselMount.innerHTML = renderCarousel(
      project.caseStudyImages,
      base,
      "viking-carousel",
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

function refreshContent() {
  mountLayout();
  initMobileNav();
  initLanguageSwitch();
  renderAboutPage();
  renderProjectsPage();
  renderCvPage();
  renderVikingCaseStudy();
  initCarousels();
  initProjectSubnav();
}

document.addEventListener("DOMContentLoaded", () => {
  setLocale(getLocale());
  refreshContent();
});
