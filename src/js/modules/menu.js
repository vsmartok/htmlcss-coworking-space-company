import { one } from "./_helpers.js";
import { lockPageScroll, unlockPageScroll } from "./scroll-lock.js";

const getOutside = () => {
  const selectors = [".page__main", ".footer"];
  const notFound = [];

  const elements = selectors.map((s) => {
    const el = document.querySelector(s);
    if (!el) notFound.push(s);

    return el;
  });

  if (notFound.length > 0)
    console.warn("[Menu]: Elements to make inert were not found", notFound);

  return elements.filter(Boolean);
};

export function initMenu() {
  const buttons = document.querySelectorAll("[data-menu-toggle]");
  const header = one(document, "[data-menu-open]", "Menu");

  if (!buttons.length || !header) {
    console.error("[Menu]: Required menu elements were not found.", {
      header,
      buttons,
    });

    return;
  }

  let lastTrigger = null;

  const mobileQuery = matchMedia("(width < 768px)");
  const isMenuOpen = () => header.dataset.menuOpen === "true";
  const outside = getOutside();
  const panel = document.getElementById(
    buttons[0].getAttribute("aria-controls"),
  );

  const open = (trigger) => {
    if (isMenuOpen()) return;

    lastTrigger = trigger;

    outside.forEach((el) => (el.inert = true));

    header.dataset.menuOpen = "true";
    buttons.forEach((b) => b.setAttribute("aria-expanded", "true"));

    lockPageScroll();
  };

  const close = ({ restoreFocus = false } = {}) => {
    if (!isMenuOpen()) return;

    outside.forEach((el) => (el.inert = false));

    header.dataset.menuOpen = "false";
    buttons.forEach((b) => b.setAttribute("aria-expanded", "false"));

    unlockPageScroll();

    if (restoreFocus) lastTrigger?.focus({ preventScroll: true });
  };

  buttons.forEach((btn) =>
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      if (isMenuOpen()) {
        close();
      } else {
        open(btn);
      }
    }),
  );

  panel?.addEventListener("click", (e) => {
    if (e.target.closest("a")) close();
  });

  mobileQuery.addEventListener("change", (e) => {
    header.dataset.menuNoTransition = "";
    if (!e.matches) close();

    requestAnimationFrame(() =>
      requestAnimationFrame(() => delete header.dataset.menuNoTransition),
    );
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isMenuOpen()) {
      close({ restoreFocus: true });
    }
  });
}
