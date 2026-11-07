import gulp from "gulp";
import { paths } from "../paths.js";
import { html } from "./html.js";
import { css } from "./css.js";
import { js } from "./js.js";
import { images } from "./images.js";
import { video } from "./video.js";
import { fonts } from "./fonts.js";
import { icons } from "./icons.js";
import { publicAssets } from "./public.js";
import { server } from "./server.js";

async function rebuildHtml() {
  const success = await html();

  if (success) {
    server.reload();
  }
}

async function rebuildCss() {
  const success = await css();

  if (success) {
    server.reload("*.css");
  }
}

async function rebuildJs() {
  const success = await js();

  if (success) {
    server.reload();
  }
}

async function rebuildImages() {
  const success = await images();

  if (success) {
    server.reload();
  }
}

async function rebuildVideo() {
  const success = await video();

  if (success) {
    server.reload();
  }
}

async function rebuildFonts() {
  const success = await fonts();

  if (success) {
    server.reload();
  }
}

async function rebuildIcons() {
  const success = await icons();

  if (success) {
    server.reload();
  }
}

async function rebuildPublic() {
  const success = await publicAssets();

  if (success) {
    server.reload();
  }
}

export function watchFiles() {
  gulp.watch(paths.css.watch, rebuildCss);
  gulp.watch(paths.js.watch, rebuildJs);

  gulp.watch(
    paths.images.map((group) => group.src),
    { nocase: true },
    rebuildImages,
  );

  gulp.watch(
    paths.video.map((group) => group.src),
    rebuildVideo,
  );

  gulp.watch(paths.fonts.src, rebuildFonts);
  gulp.watch(paths.icons.src, rebuildIcons);
  gulp.watch(paths.public.src, rebuildPublic);

  return gulp.watch(paths.html.watch, rebuildHtml);
}
