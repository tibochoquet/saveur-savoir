// Cookietoestemming (AVG): niets wordt geladen of gemeten vóór expliciete
// toestemming. Zie CookieBanner.astro voor de UI en [juridisch].astro
// (cookievoorkeuren) voor de herroepmogelijkheid.
const STORAGE_KEY = "cookie-consent";
const GA_COOKIE_PREFIX = "_ga";

export type ConsentChoice = "granted" | "denied";

declare global {
  interface Window {
    dataLayer: unknown[];
    __GA_ID__?: string;
  }
}

function gtag(...args: unknown[]) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(args);
}

export function getStoredConsent(): ConsentChoice | null {
  const value = localStorage.getItem(STORAGE_KEY);
  return value === "granted" || value === "denied" ? value : null;
}

function clearGaCookies() {
  const names = document.cookie.split(";").map((c) => c.trim().split("=")[0]);
  for (const name of names) {
    if (name === GA_COOKIE_PREFIX || name.startsWith(`${GA_COOKIE_PREFIX}_`)) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    }
  }
}

let gtagScriptLoaded = false;
function loadGtagScript(gaId: string) {
  if (gtagScriptLoaded) return;
  gtagScriptLoaded = true;
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(script);
  gtag("js", new Date());
  gtag("config", gaId);
}

// Moet zo vroeg mogelijk draaien — vóór er ooit een gtag.js-script geladen
// wordt — zodat Google Consent Mode v2 altijd met 'denied' als startpunt
// begint, ongeacht of deze bezoeker al eerder een keuze maakte.
export function setDefaultDeniedConsent() {
  gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    wait_for_update: 500,
  });
}

// Past een eerder opgeslagen keuze toe (herhaalbezoek) — laadt gtag.js pas
// nu, nooit vooraf, en nooit als er geweigerd is.
export function applyStoredConsent(gaId: string | undefined): ConsentChoice | null {
  const stored = getStoredConsent();
  if (stored === "granted") {
    gtag("consent", "update", { analytics_storage: "granted" });
    if (gaId) loadGtagScript(gaId);
  }
  return stored;
}

// Slaat een nieuwe keuze op (accepteren/weigeren, ook bij het wijzigen via
// de Cookievoorkeuren-pagina) en past Consent Mode + het laden van gtag.js
// direct toe.
export function applyConsent(choice: ConsentChoice, gaId: string | undefined) {
  localStorage.setItem(STORAGE_KEY, choice);
  if (choice === "granted") {
    gtag("consent", "update", { analytics_storage: "granted" });
    if (gaId) loadGtagScript(gaId);
  } else {
    gtag("consent", "update", { analytics_storage: "denied" });
    clearGaCookies();
  }
  window.dispatchEvent(new CustomEvent("cookie-consent-changed", { detail: { choice } }));
}
