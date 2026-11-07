import { lockPageScroll, unlockPageScroll } from "./scroll-lock.js";

let initialized = false;
let activeDialog = null;
let openRequest = 0;

function cancelDialogAnimations(state) {
  state.animations.forEach((animation) => animation.cancel());
  state.animations = [];
}

async function animateDialog(state, opening) {
  const dialog = state.element;
  const dialogBody = dialog.querySelector(":scope > .dialog__panel");

  const dialogStyles = getComputedStyle(dialog);
  const dialogBodyStyles = getComputedStyle(dialogBody);
  const interrupted = state.animations.length > 0;

  const offset =
    dialogStyles.getPropertyValue("--dialog-offset").trim() || "1rem";
  const backdropColor = dialogStyles
    .getPropertyValue("--dialog-backdrop-color")
    .trim();
  const startBackground =
    opening && !interrupted ? "transparent" : dialogStyles.backgroundColor;
  const startOpacity = opening && !interrupted ? "0" : dialogStyles.opacity;

  const startTransform =
    opening && !interrupted ? `translateY(${offset})` : dialogStyles.transform;

  cancelDialogAnimations(state);

  const durationValue = dialogStyles
    .getPropertyValue("--dialog-duration")
    .trim();

  const configuredDurationValue =
    durationValue === "" ? 250 : Number(durationValue);

  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const duration = reducedMotion
    ? 0
    : Number.isFinite(configuredDurationValue)
      ? Math.max(0, configuredDurationValue)
      : 250;

  if (duration === 0) return true;

  const easing =
    dialogStyles.getPropertyValue("--dialog-easing").trim() || "ease";

  const options = {
    duration,
    easing,
    fill: "both",
  };

  const animations = [
    dialog.animate(
      [
        { backdropColor: startBackground },
        { backdropColor: opening ? backdropColor : "transparent" },
      ],
      options,
    ),
    dialogBody.animate(
      [
        { opacity: startOpacity, transform: startTransform },
        {
          opacity: opening ? 1 : 0,
          transform: opening ? "none" : `translateY(${offset})`,
        },
      ],
      options,
    ),
  ];

  state.animations = animations;

  const results = await Promise.allSettled(
    animations.map((animation) => animation.finished),
  );

  return (
    state.animations === animations &&
    results.every((r) => r.status === "fulfilled")
  );
}

async function open(dialog, trigger) {
  if (dialog === activeDialog?.element && !activeDialog.closing) return;

  if (!dialog.querySelector(":scope > .dialog__panel")) {
    console.warn("[Dialog]: Missing '.dialog__panel'", dialog);

    return;
  }

  const request = ++openRequest;

  const returnFocus = activeDialog?.element.contains(trigger)
    ? activeDialog.returnFocus
    : trigger;

  if (activeDialog) {
    await close({
      restoreFocus: false,
      unlockScroll: false,
    });
  }

  if (request !== openRequest) return;

  lockPageScroll();

  const state = {
    element: dialog,
    returnFocus,
    animations: [],
    closing: false,
    closePromise: null,
    closeOptions: null,
  };

  activeDialog = state;

  dialog.showModal();

  const completed = await animateDialog(state, true);

  if (completed && activeDialog === state && !state.closing) {
    cancelDialogAnimations(state);
  }
}

async function close({ restoreFocus = true, unlockScroll = true } = {}) {
  if (!activeDialog) return Promise.resolve();

  const state = activeDialog;

  if (state.closing) {
    state.closeOptions.restoreFocus &&= restoreFocus;
    state.closeOptions.unlockScroll &&= unlockScroll;

    return state.closePromise;
  }

  state.closing = true;
  state.closeOptions = { restoreFocus, unlockScroll };

  state.closePromise = (async () => {
    const completed = state.element.open
      ? await animateDialog(state, false)
      : true;

    if (!completed || activeDialog !== state) return;

    activeDialog = null;

    if (state.element.open) state.element.close();

    cancelDialogAnimations(state);

    if (state.closeOptions.unlockScroll) unlockPageScroll();

    if (state.closeOptions.restoreFocus && state.returnFocus?.isConnected) {
      state.returnFocus.focus({ preventScroll: true });
    }
  })();

  return state.closePromise;
}

export function initDialogs() {
  if (initialized) return;

  document.querySelectorAll("dialog.dialog").forEach((dialog) => {
    let backdropPress = false;

    dialog.addEventListener("pointerdown", (e) => {
      backdropPress = e.isPrimary && e.button === 0 && e.target === dialog;
    });

    dialog.addEventListener("pointerup", (e) => {
      backdropPress = backdropPress && e.target === dialog;
    });

    dialog.addEventListener("pointercancel", () => {
      backdropPress = false;
    });

    dialog.addEventListener("click", (e) => {
      const shouldClose = backdropPress && e.target === dialog;
      backdropPress = false;

      if (
        shouldClose &&
        activeDialog?.element === dialog &&
        dialog.dataset.modalCloseOnBackdrop !== "false"
      ) {
        close();
      }
    });

    dialog.addEventListener("cancel", (e) => {
      e.preventDefault();

      if (activeDialog?.element === dialog) {
        close();
      }
    });

    dialog.addEventListener("close", (e) => {
      if (activeDialog?.element === dialog && !dialog.open) {
        close();
      }
    });
  });

  document.addEventListener("click", (e) => {
    if (!(e.target instanceof Element)) return;

    const openButton = e.target.closest("[data-dialog-open]");
    if (openButton) {
      const dialog = document.getElementById(openButton.dataset.dialogOpen);

      if (
        !(dialog instanceof HTMLDialogElement) ||
        !dialog.matches(".dialog")
      ) {
        console.warn("[Dialog] Check the target dialog id", openButton);

        return;
      }

      open(dialog, openButton);

      return;
    }

    const closeButton = e.target.closest("[data-dialog-close]");
    if (
      closeButton &&
      activeDialog?.element === closeButton.closest("dialog.dialog")
    ) {
      close();
    }
  });

  initialized = true;
}
