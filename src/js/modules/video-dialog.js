export function initVideoDialog() {
  document.addEventListener("click", (e) => {
    if (!(e.target instanceof Element)) return;

    const trigger = e.target.closest("[data-video-id]");
    if (!trigger) return;

    const dialog = document.getElementById(trigger.dataset.dialogOpen);
    const slot = dialog?.querySelector("[data-video-slot]");
    if (!slot) return;

    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube-nocookie.com/embed/${trigger.dataset.videoId}?autoplay=1&rel=0`;
    iframe.title = trigger.dataset.videoTitle ?? "Video";
    iframe.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";

    slot.replaceChildren(iframe);
  });

  document
    .querySelectorAll("dialog [data-video-slot]")
    .forEach((slot) =>
      slot
        .closest("dialog")
        .addEventListener("close", () => slot.replaceChildren()),
    );
}
