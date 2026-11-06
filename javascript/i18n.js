const STORAGE_KEY = "portfolio-locale";
const DEFAULT_LOCALE = "sv";

export function getLocale() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "en" || stored === "sv") return stored;
  const htmlLang = document.documentElement.lang;
  if (htmlLang === "en" || htmlLang === "sv") return htmlLang;
  return DEFAULT_LOCALE;
}

export function setLocale(locale) {
  const next = locale === "en" ? "en" : "sv";
  localStorage.setItem(STORAGE_KEY, next);
  document.documentElement.lang = next;
  return next;
}

/** Pick a localized string or `{ sv, en }` object. */
export function pickLocalized(value, locale = getLocale()) {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    return value[locale] ?? value.sv ?? value.en ?? "";
  }
  return String(value);
}

export function pickLocalizedList(value, locale = getLocale()) {
  const list = pickLocalized(value, locale);
  return Array.isArray(list) ? list : [];
}
