import { one } from "./_helpers.js";

function getScrollStep(list) {
  const gap = parseFloat(getComputedStyle(list).columnGap) || 0;

  const card = list.querySelector(":scope > li");

  return card.getBoundingClientRect().width + gap;
}

export function initTestimonials() {
  const container = one(document, "[data-testimonials-slider]", "Testimonials");
  if (!container) return;

  const slider = one(container, "[data-testimonials-list]", "Testimonials");
  if (!slider) return;

  const buttons = one(container, "[data-testimonials-buttons]", "Testimonials");
  if (!buttons) return;

  const prevBtn = one(container, "[data-testimonials-prev]", "Testimonials");
  const nextBtn = one(container, "[data-testimonials-next]", "Testimonials");
  if (!prevBtn || !nextBtn) return;

  const scrollByStep = (direction) => {
    const behavior = matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth";
    slider.scrollBy({ left: direction * getScrollStep(slider), behavior });
  };

  buttons.hidden = false;

  prevBtn.addEventListener("click", () => scrollByStep(-1));
  nextBtn.addEventListener("click", () => scrollByStep(1));

  const updateButtons = () => {
    const { scrollLeft, clientWidth, scrollWidth } = slider;

    prevBtn.setAttribute("aria-disabled", String(scrollLeft <= 1));
    nextBtn.setAttribute(
      "aria-disabled",
      String(scrollLeft + clientWidth >= scrollWidth - 1),
    );
  };

  slider.addEventListener("scroll", updateButtons, { passive: true });
  new ResizeObserver(updateButtons).observe(slider);
  updateButtons();
}
