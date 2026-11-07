export function one(root, selector, title = "Document") {
  const found = root.querySelectorAll(selector);

  if (found.length !== 1) {
    console.warn(
      `[${title}] expected 1 ${selector}, found ${found.length ?? 0}`,
      root,
    );
  }

  return found[0] ?? null;
}
