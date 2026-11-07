export function initNewsletter() {
  const form = document.querySelector("[data-newsletter-form]");
  const status = document.querySelector("[data-newsletter-status]");
  if (!form || !status) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    form.reset();
    status.textContent = "Thanks for subscribing!";
  });
}
