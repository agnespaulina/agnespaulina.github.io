/**
 * Single source of truth for site copy, images and project data.
 * Edit objects here to update UI text, icons, tags and screenshots.
 */
import { resolveAssetPath } from "./assets.js";
import { getLocale, pickLocalized, pickLocalizedList } from "./i18n.js";

export { resolveAssetPath };

export const ICONS = {
  email: "assets/icons/garden_email-fill-20.svg",
  phone: "assets/icons/iconPhone.svg",
  linkedIn: "assets/icons/icon_linkedIn.svg",
  download: "assets/icons/icon_download.svg",
  appStore: "assets/icons/icon_downloadAppStore.svg",
  googlePlay: "assets/icons/icon_downloadGooglePlay.svg",
};

/**
 * Site chrome (web-page-header). Edit here to update the header on every page.
 * Tabs: `nav`. Identity: `name` + `title`. Mail: `nav.email`. Language: `lang`.
 */
export const SITE = {
  name: "Agnes Sandberg",
  title: {
    sv: "Mobilapputvecklare",
    en: "Mobile app developer",
  },
  footer: {
    sv: "All rights reserved.",
    en: "All rights reserved.",
  },
  lang: {
    en: { full: "English", abbr: "En" },
    sv: { full: "Swedish", abbr: "Sv" },
  },
  nav: {
    about: { sv: "Om mig", en: "About", href: "about.html" },
    projects: { sv: "Projekt", en: "Projects", href: "projects.html" },
    cv: { sv: "CV", en: "CV", href: "cv.html" },
    email: {
      sv: "Mejla mig",
      en: "E-mail me",
      href: "mailto:agnessandberg@live.se",
    },
  },
};

export const CONTACT = {
  phone: "+46 723 312 828",
  phoneHref: "tel:+46723312828",
  email: "agnessandberg@live.se",
  emailHref: "mailto:agnessandberg@live.se",
  linkedInUrl: "https://www.linkedin.com/in/agnes-sandberg",
  linkedInHandle: "agnes-sandberg",
};

export const ABOUT = {
  profileImage: "assets/images/profileImage.jpg",
  bio: {
    sv: [
      "Jag är system- och mobilutvecklare med fokus på Flutter och produktionsappar för iOS och Android. I min vardag arbetar jag med allt från affärslogik och API-integrationer till plattformsspecifika detaljer som pushnotiser, deep links och release till App Store och Google Play.",
      "Jag trivs i projekt där kodbasen behöver bli mer förutsägbar — till exempel när prisregler spridits över flera lager eller när asynkrona SDK-anrop måste samordnas utan race conditions. Då prioriterar jag tydliga domänmodeller, testbarhet och gradvis refaktorering.",
      "Utöver utveckling har jag erfarenhet av tidiga produktfaser: kravanalys, flöden, prototyper och samarbete med design och intressenter. Målet är alltid att leverera något som är robust i produktion och begripligt för teamet att bygga vidare på.",
    ],
    en: [
      "I am a software and mobile developer focused on Flutter and production apps for iOS and Android. My day-to-day work spans business logic and API integrations as well as platform-specific concerns such as push notifications, deep links, and App Store / Google Play releases.",
      "I enjoy projects where the codebase needs to become more predictable — for example when pricing rules have spread across layers or when asynchronous SDK calls must be coordinated without race conditions. I prioritise clear domain models, testability, and incremental refactoring.",
      "Beyond implementation I have experience in early product work: requirements analysis, user flows, prototypes, and collaboration with design and stakeholders. The goal is always something robust in production and straightforward for the team to extend.",
    ],
  },
  contactHeading: { sv: "Kontakt", en: "Contact" },
  skillsHeading: {
    sv: "Programmeringserfarenhet",
    en: "Programming experience",
  },
  toolsHeading: { sv: "Verktyg", en: "Tools" },
  skills: [
    {
      name: "Flutter",
      icon: "assets/svg/programming_languages/Language=Flutter.svg",
      level: 5,
    },
    {
      name: "Java",
      icon: "assets/svg/programming_languages/Language=Java.svg",
      level: 4,
    },
    {
      name: "Kotlin",
      icon: "assets/svg/programming_languages/Language=Kotlin.svg",
      level: 3,
    },
    {
      name: "Swift",
      icon: "assets/svg/programming_languages/Language=Swift.svg",
      level: 3,
    },
    {
      name: "C#",
      icon: "assets/svg/programming_languages/Language=C#.svg",
      level: 4,
    },
    {
      name: "Python",
      icon: "assets/svg/programming_languages/Language=Python.svg",
      level: 2,
    },
    {
      name: "React",
      icon: "assets/svg/programming_languages/Language=React.svg",
      level: 2,
    },
    {
      name: "HTML",
      icon: "assets/svg/programming_languages/Language=HTML.svg",
      level: 3,
    },
    {
      name: "CSS",
      icon: "assets/svg/programming_languages/Language=CSS.svg",
      level: 3,
    },
    {
      name: "JavaScript",
      icon: "assets/svg/programming_languages/Language=JavaScript.svg",
      level: 2,
    },
  ],
  tools: [
    { name: "Xcode", icon: "assets/svg/tools_icons/tool=xcode.svg" },
    {
      name: "Apple Connect",
      icon: "assets/svg/tools_icons/tool=appeConnect.svg",
    },
    {
      name: "Google Play Console",
      icon: "assets/svg/tools_icons/tool=googleConsole.svg",
    },
    {
      name: "Android Studio",
      icon: "assets/svg/tools_icons/tool=androidStudio.svg",
    },
    { name: "Firebase", icon: "assets/svg/tools_icons/tool=firebase.svg" },
    { name: "Figma", icon: "assets/svg/tools_icons/tool=figma.svg" },
    { name: "Azure DevOps", icon: "assets/svg/tools_icons/tool=azure.svg" },
    { name: "Postman", icon: "assets/svg/tools_icons/tool=postman.svg" },
    { name: "Supabase", icon: "assets/svg/tools_icons/tool=supabase.svg" },
    { name: "Docker", icon: "assets/svg/tools_icons/tool=docker.svg" },
    { name: "Cursor", icon: "assets/svg/tools_icons/tool=cursor.svg" },
    { name: "Claude", icon: "assets/svg/tools_icons/tool=claude.svg" },
    {
      name: "Unreal Engine 5",
      icon: "assets/svg/tools_icons/tool=unrealEnginge5.svg",
    },
    { name: "Unity", icon: "assets/svg/tools_icons/tool=unity.svg" },
    { name: "Photoshop", icon: "assets/svg/tools_icons/tool=photoshop.svg" },
  ],
};

/** UI copy (navigated pages, chrome, case study). */
export const UI = {
  skipToContent: { sv: "Hoppa till innehåll", en: "Skip to content" },
  mainNavAria: { sv: "Huvudnavigering", en: "Main navigation" },
  langSwitchAria: { sv: "Språk", en: "Language" },
  projectSubnavAria: { sv: "Projektsektioner", en: "Project sections" },
  carouselPrev: { sv: "Föregående", en: "Previous" },
  carouselNext: { sv: "Nästa", en: "Next" },
  carouselSlideLabel: { sv: "Bild", en: "Image" },
  caseStudyLink: { sv: "Case study", en: "Case study" },
  pageTitle: {
    about: { sv: "Om mig", en: "About" },
    projects: { sv: "Projekt", en: "Projects" },
    cv: { sv: "CV", en: "CV" },
    "project-viking": { sv: "Viking Assistance", en: "Viking Assistance" },
  },
};

export const CASE_STUDY_SUBNAV = [
  { id: "overview", label: { sv: "Översikt", en: "Overview" } },
  { id: "contribution", label: { sv: "Mitt bidrag", en: "My contribution" } },
  {
    id: "challenges",
    label: { sv: "Tekniska utmaningar", en: "Technical challenges" },
  },
  {
    id: "architecture",
    label: {
      sv: "Arkitektur och implementation",
      en: "Architecture & implementation",
    },
  },
  {
    id: "results",
    label: { sv: "Resultat och lärdomar", en: "Results & learnings" },
  },
];

export const CV = {
  areasHeading: { sv: "Mina kompetensområden", en: "My competency areas" },
  resumeHeading: { sv: "Mitt CV", en: "My CV" },
  resumeIntro: {
    sv: "Vill du veta mer om min erfarenhet? Här hittar du mitt fullständiga CV med arbetslivserfarenhet, projekt, utbildning och tekniska kompetenser.",
    en: "Want to know more about my experience? Here you’ll find my full CV with work history, projects, education, and technical skills.",
  },
  viewCvLabel: { sv: "Visa CV", en: "View CV" },
  downloadLabel: { sv: "Ladda ner CV", en: "Download CV" },
  overlayCloseAria: { sv: "Stäng CV-förhandsvisning", en: "Close CV preview" },
  pdfLoading: { sv: "Laddar CV…", en: "Loading CV…" },
  pdfError: {
    sv: "Kunde inte visa CV i webbläsaren.",
    en: "Could not display the CV in the browser.",
  },
  openPdfInTab: { sv: "Öppna PDF i ny flik", en: "Open PDF in a new tab" },
  competencyAreas: [
    {
      icon: "assets/svg/system_architecture.svg",
      title: {
        sv: "Systemarkitektur och affärslogik",
        en: "System architecture & business logic",
      },
      description: {
        sv: "Utformar och förbättrar systemstrukturer med fokus på tydliga datamodeller, centraliserad affärslogik och kod som är enkel att underhålla och vidareutveckla.",
        en: "Designs and improves system structures with clear data models, centralised business logic, and code that is easy to maintain and extend.",
      },
    },
    {
      icon: "assets/svg/platform_specific_development.svg",
      title: {
        sv: "Plattformsspecifik utveckling",
        en: "Platform-specific development",
      },
      description: {
        sv: "Utvecklar för iOS och Android med fokus på native-integrationer, pushnotiser, bakgrundsprocesser och konsekvent beteende mellan plattformarna.",
        en: "Builds for iOS and Android with a focus on native integrations, push notifications, background work, and consistent behaviour across platforms.",
      },
    },
    {
      icon: "assets/svg/data_integrity_and_synchronization.svg",
      title: {
        sv: "Dataintegritet och synkronisering",
        en: "Data integrity & synchronisation",
      },
      description: {
        sv: "Arbetar med lokal datalagring, databastransaktioner och synkroniseringsflöden för tillförlitlig datahantering även vid instabil uppkoppling.",
        en: "Works with local storage, database transactions, and sync flows for reliable data handling even on unstable connections.",
      },
    },
    {
      icon: "assets/svg/debugging_and_quality_assurance.svg",
      title: {
        sv: "Felsökning och kvalitetssäkring",
        en: "Debugging & quality assurance",
      },
      description: {
        sv: "Analyserar komplexa problem, identifierar grundorsaker och förbättrar stabilitet, prestanda och testbarhet i befintliga system.",
        en: "Analyses complex issues, finds root causes, and improves stability, performance, and testability in existing systems.",
      },
    },
    {
      icon: "assets/svg/product_development_and_ux.svg",
      title: {
        sv: "Produktutveckling och UX",
        en: "Product development & UX",
      },
      description: {
        sv: "Kombinerar teknisk utveckling med erfarenhet av kravanalys, prototyper, användartester och användarcentrerad design.",
        en: "Combines engineering with requirements analysis, prototyping, user testing, and user-centred design.",
      },
    },
  ],
  files: {
    sv: "assets/documents/agnes_sandberg_cv_sv.pdf",
    en: "assets/documents/agnes_sandberg_cv_en.pdf",
  },
  preview: {
    sv: "assets/documents/agnes_sandberg_cv_sv.pdf",
    en: "assets/documents/agnes_sandberg_cv_en.pdf",
  },
};

/**
 * Portfolio projects shown on Projects page (order matters).
 * Optional `screenshot2x` (string path): high-DPI asset used in `srcset` for `.project-panel__screenshot`.
 */
export const PROJECTS = [
  {
    slug: "mecom",
    visible: true,
    name: "Mecom",
    roleType: { sv: "Eget projekt", en: "Personal project" },
    period: "2025–2026",
    logo: "assets/images/logo_mecom.jpg",
    screenshot: "assets/images/app_image_selections/Image_section_mecom.png",
    tags: ["Flutter", "Git", "SQLite", "Supabase"],
    description: {
      sv: "Applikation för att organisera produkter i personliga kataloger med varumärken, kategorier och filtrering. Local-first med Drift/SQLite och synkronisering mot Supabase.",
      en: "App for organising products in personal catalogues with brands, categories, and filtering. Local-first with Drift/SQLite and sync to Supabase.",
    },
    bullets: {
      sv: [
        "Server-first-arkitektur med outbox och atomiska transaktioner.",
        "Design och implementation av synkronisering mot Supabase.",
        "Datamodellering för produkter, varumärken och importflöden.",
      ],
      en: [
        "Server-first architecture with outbox and atomic transactions.",
        "Designed and implemented Supabase synchronisation.",
        "Data modelling for products, brands, and import flows.",
      ],
    },
    stores: {},
    caseStudy: null,
  },
  {
    slug: "viking",
    visible: true,
    name: "Viking Assistance",
    roleType: {
      sv: "Projektanställd apputvecklare",
      en: "Contract app developer",
    },
    period: "2025–2026",
    logo: "assets/images/logo_viking.jpg",
    screenshot: "assets/images/app_image_selections/Image_section_viking.png",
    tags: ["Flutter", "Git", "SQLite", "Firebase", "Intercom"],
    description: {
      sv: "Medlemsapp för vägassistans, försäkring och betalningar. Jag vidareutvecklade central affärslogik, betalningsflöden och plattformsintegrationer i en produktionsapp med stora användarvolymer.",
      en: "Membership app for roadside assistance, insurance, and payments. I extended core business logic, payment flows, and platform integrations in a high-traffic production app.",
    },
    bullets: {
      sv: [
        "Design och implementation av betalnings- och prislogik (ProductPriceResolver).",
        "Pushnotiser, Intercom och native bryggor för iOS/Android.",
        "Testning, Crashlytics och release via App Store och Google Play.",
      ],
      en: [
        "Designed and implemented payment and pricing logic (ProductPriceResolver).",
        "Push notifications, Intercom, and native bridges for iOS/Android.",
        "Testing, Crashlytics, and releases via App Store and Google Play.",
      ],
    },
    stores: {
      appStore: "https://apps.apple.com/no/app/viking-assistance/id6449096742",
      playStore:
        "https://play.google.com/store/apps/details?id=no.vikingredning.app",
    },
    caseStudy: {
      href: "projects/viking.html",
      /** Set to `true` when the case study page is ready to link from Projects. */
      linkVisible: false,
      images: [
        {
          src: "assets/projects/viking/images/Screenshot 2026-11-04 at 12.15.02.png",
          alt: {
            sv: "Skärmdump Viking Assistance",
            en: "Viking Assistance screenshot",
          },
        },
        {
          src: "assets/projects/viking/images/intercom_run_exclusive_problem.png",
          alt: {
            sv: "Intercom: problem före koordinering",
            en: "Intercom: issue before coordination",
          },
        },
        {
          src: "assets/projects/viking/images/intercom_run_exclusive_result.png",
          alt: {
            sv: "Intercom: sekventiell kö",
            en: "Intercom: sequential queue",
          },
        },
      ],
    },
  },
  {
    slug: "wakil",
    visible: true,
    name: "Wakil",
    roleType: {
      sv: "Projektanställd apputvecklare",
      en: "Contract app developer",
    },
    period: "2026",
    logo: "assets/images/logo_wakil.jpg",
    screenshot: "assets/images/app_image_selections/Image_section_wakil.png",
    tags: ["Flutter", "Git", "Firebase", "REST API"],
    description: {
      sv: "Säkerhetsapp med larmflöden och positionsdelning till larmcentral. Fokus på tillförlitlig bakgrundspositionering och plattformsspecifika begränsningar.",
      en: "Security app with alarm flows and location sharing to an alarm centre. Focus on reliable background positioning and platform constraints.",
    },
    bullets: {
      sv: [
        "Design och implementation av larm- och PIN-flöden.",
        "Bakgrundspositionering och FCM på iOS och Android.",
        "Geografiska polygoner och kommunikation med backend.",
      ],
      en: [
        "Designed and implemented alarm and PIN flows.",
        "Background positioning and FCM on iOS and Android.",
        "Geographic polygons and backend communication.",
      ],
    },
    stores: {},
    caseStudy: null,
  },
  {
    slug: "speedbox",
    visible: true,
    name: "Speedbox",
    roleType: {
      sv: "Projektanställd apputvecklare",
      en: "Contract app developer",
    },
    period: "2024–2026",
    logo: "assets/images/logo_speedbox.jpg",
    screenshot: "assets/images/app_image_selections/Image_section_speedbox.png",
    tags: ["Flutter", "Git", "Blender", "3D"],
    description: {
      sv: "3D-visualisering och produktpresentation av förvaringsskåp med korrekta mått och heuristisk UX-analys för att förmedla kapacitet.",
      en: "3D visualisation and product presentation of storage lockers with accurate dimensions and heuristic UX analysis to communicate capacity.",
    },
    bullets: {
      sv: [
        "Skalbara Blender-modeller och material i Geometry Nodes.",
        "Heuristisk UX-analys och produktinnehåll för app och webb.",
        "Samarbete kring hur 3D-innehåll integreras i användarflöden.",
      ],
      en: [
        "Scalable Blender models and materials with Geometry Nodes.",
        "Heuristic UX analysis and product content for app and web.",
        "Collaboration on integrating 3D content into user flows.",
      ],
    },
    stores: {
      website: "https://www.speedbox.eu",
      websiteBadge: "assets/icons/badge_speedbox_website.svg",
      websiteLabel: {
        sv: "Besök Speedbox officiella webbplats",
        en: "Visit the official Speedbox website",
      },
    },
    caseStudy: null,
  },
  {
    slug: "pigello",
    visible: false,
    name: "Pigello",
    roleType: { sv: "Konsult · UX/produkt", en: "Consulting · UX/product" },
    period: "Consulting",
    logo: "assets/projects/pigello/images/tf_low-fidelity-skiss.png",
    screenshot: "assets/projects/pigello/images/marknad_final_handover.png",
    tags: ["UX", "Prototyping", "SaaS"],
    description: {
      sv: "Kravanalys och prototyper för ny mobilapp och köhanteringsmodul.",
      en: "Requirements analysis and prototypes for a new mobile app and queue module.",
    },
    bullets: { sv: [], en: [] },
    stores: {},
    caseStudy: null,
  },
];

export function getVisibleProjects() {
  return PROJECTS.filter((p) => p.visible !== false);
}

export function getProjectBySlug(slug) {
  return PROJECTS.find((p) => p.slug === slug) ?? null;
}

/** Normalized view model for rendering (locale applied). */
export function getProjectViewModel(slug, locale = getLocale()) {
  const project = getProjectBySlug(slug);
  if (!project) return null;
  return {
    ...project,
    description: pickLocalized(project.description, locale),
    bullets: pickLocalizedList(project.bullets, locale),
    roleType: pickLocalized(project.roleType, locale),
    caseStudyImages:
      project.caseStudy?.images?.map((img) => ({
        src: img.src,
        alt: pickLocalized(img.alt, locale),
      })) ?? [],
  };
}
