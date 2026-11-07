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
  appStore: "assets/icons/icon_downloadAppStore.svg",
  googlePlay: "assets/icons/icon_downloadGooglePlay.svg",
};

export const SITE = {
  name: "Agnes Sandberg",
  title: {
    sv: "Mobile app developer",
    en: "Mobile app developer",
  },
  footer: {
    sv: "All rights reserved.",
    en: "All rights reserved.",
  },
  nav: {
    about: { sv: "About", en: "About", href: "about.html" },
    projects: { sv: "Projects", en: "Projects", href: "projects.html" },
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
  contactHeading: { sv: "Contact", en: "Contact" },
  skillsHeading: {
    sv: "Programming experiance",
    en: "Programming experience",
  },
  toolsHeading: { sv: "Tools", en: "Tools" },
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
    { name: "Cursor", icon: "assets/svg/tools_icons/tool=claude.svg" },
    { name: "Claude", icon: "assets/svg/tools_icons/tool=cursor.svg" },
    {
      name: "Unreal Engine 5",
      icon: "assets/svg/tools_icons/tool=unrealEnginge5.svg",
    },
    { name: "Unity", icon: "assets/svg/tools_icons/tool=unity.svg" },
    { name: "Photoshop", icon: "assets/svg/tools_icons/tool=photoshop.svg" },
  ],
};

export const CV = {
  downloadLabel: { sv: "Download", en: "Download" },
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
    stores: {},
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
