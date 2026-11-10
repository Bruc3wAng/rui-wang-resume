import type { Language } from "../content/resume";

type Fragment = `#${string}`;
export type HistoryMode = "push" | "replace";
const changeEvent = "portfolio-fragment-change";
const casePrefix = "#study-";
const outputPrefix = "#output-";
const practicePrefix = "#practice-";
const mapPrefix = "#map-";

export function studyFragment(id: string): Fragment { return `${casePrefix}${id}`; }

export function studyIndexFromFragment(fragment: string | null, studies: readonly { id: string }[]) {
  return fragment?.startsWith(casePrefix) ? studies.findIndex(study => studyFragment(study.id) === fragment) : -1;
}

export function outputFragment(studyId: string, outputId: string): Fragment { return `${outputPrefix}${studyId}--${outputId}`; }

export function outputFromFragment(fragment: string | null, studies: readonly { id: string; outputs: readonly { id: string }[] }[]) {
  if (!fragment?.startsWith(outputPrefix)) return null;
  for (const [workIndex, study] of studies.entries()) {
    const outputIndex = study.outputs.findIndex(output => outputFragment(study.id, output.id) === fragment);
    if (outputIndex >= 0) return { workIndex, outputIndex };
  }
  return null;
}

export function practiceFragment(id: string): Fragment { return `${practicePrefix}${id}`; }

export function practiceIndexFromFragment(fragment: string | null, practices: readonly { id: string }[]) {
  return fragment?.startsWith(practicePrefix) ? practices.findIndex(practice => practiceFragment(practice.id) === fragment) : -1;
}

export function mapFragment(id: string): Fragment { return `${mapPrefix}${id}`; }

export function mapIndexFromFragment(fragment: string | null, ids: readonly string[]) {
  return fragment?.startsWith(mapPrefix) ? ids.findIndex(id => mapFragment(id) === fragment) : -1;
}

export function portfolioLocaleHref(base: string, language: Language, fragment = "") {
  return base + (language === "en" ? "/en/" : "/") + fragment;
}

export function studyPageHref(base: string, language: Language, id: string) {
  return `${portfolioLocaleHref(base, language)}research/${id}/`;
}

// Emit this fixed, data-free initializer in the static document before the
// hosting adapter boots. Even a repeated native visit to the same anchor can
// emit popstate; it must not start a page fetch that can restore an older hash.
export const studyHistoryInitializer = `(() => {
  let previous = new URL(location.href);
  const sync = () => { previous = new URL(location.href); };
  addEventListener("popstate", event => {
    const next = new URL(location.href);
    if (next.pathname === previous.pathname && next.search === previous.search && (next.hash || previous.hash)) {
      event.stopImmediatePropagation();
    }
    previous = next;
  }, true);
  addEventListener("hashchange", sync);
  addEventListener(${JSON.stringify(changeEvent)}, sync);
})();`;

export function subscribePortfolioFragment(change: () => void) {
  window.addEventListener("hashchange", change);
  window.addEventListener(changeEvent, change);
  return () => {
    window.removeEventListener("hashchange", change);
    window.removeEventListener(changeEvent, change);
  };
}

export function browserPortfolioFragment() { return window.location.hash; }
export function staticPortfolioFragment() { return null; }

export function updatePortfolioFragment(fragment: Fragment, mode: HistoryMode = "push") {
  if (window.location.hash === fragment) return false;
  // Preserve the router's current state; this is a same-document location.
  if (mode === "replace") window.history.replaceState(window.history.state, "", fragment);
  else window.history.pushState(window.history.state, "", fragment);
  window.dispatchEvent(new Event(changeEvent));
  return true;
}
