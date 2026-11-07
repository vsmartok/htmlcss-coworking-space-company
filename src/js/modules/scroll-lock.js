let scrollState = null;
let scrollCount = 0;

export function lockPageScroll() {
  scrollCount++;
  if (scrollCount > 1) return;

  const root = document.documentElement;
  const body = document.body;

  const scrollY = window.scrollY;
  const scrollX = window.scrollX;
  const scrollbarWidth = window.innerWidth - root.clientWidth;
  const bodyPaddingRight = parseFloat(getComputedStyle(body).paddingRight);

  const savedStyles = [
    [root, ["overflow", "scroll-behavior"]],
    [body, ["position", "top", "left", "width", "padding-right"]],
  ].flatMap(([element, properties]) =>
    properties.map((property) => ({
      element,
      property,
      value: element.style.getPropertyValue(property),
      priority: element.style.getPropertyPriority(property),
    })),
  );

  scrollState = { scrollX, scrollY, savedStyles };

  root.style.setProperty("overflow", "hidden");

  body.style.setProperty("position", "fixed");
  body.style.setProperty("top", `${-scrollY}px`);
  body.style.setProperty("left", `${-scrollX}px`);
  body.style.setProperty("width", "100%");

  if (scrollbarWidth > 0) {
    body.style.setProperty(
      "padding-right",
      `${bodyPaddingRight + scrollbarWidth}px`,
    );
  }
}

export function unlockPageScroll() {
  if (scrollCount === 0) return;

  scrollCount--;
  if (scrollCount > 0) return;

  const root = document.documentElement;
  const { scrollX, scrollY, savedStyles } = scrollState;

  savedStyles.forEach(({ element, property, value, priority }) => {
    if (value) {
      element.style.setProperty(property, value, priority);
    } else {
      element.style.removeProperty(property);
    }
  });

  const savedScrollBehavior = savedStyles.find(
    ({ element, property }) =>
      element === root && property === "scroll-behavior",
  );

  root.style.setProperty("scroll-behavior", "auto", "important");
  window.scrollTo(scrollX, scrollY);

  if (savedScrollBehavior.value) {
    root.style.setProperty(
      "scroll-behavior",
      savedScrollBehavior.value,
      savedScrollBehavior.priority,
    );
  } else {
    root.style.removeProperty("scroll-behavior");
  }

  scrollState = null;
}
