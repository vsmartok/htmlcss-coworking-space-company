import { stat } from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import gulp from "gulp";
import svgSprite from "gulp-svg-sprite";
import { paths } from "../paths.js";
import { prepareIcons } from "../prepare-icons.js";
import { spriteConfig } from "../sprite-config.js";
import { withErrorHandling } from "../with-error-handling.js";

async function buildIcons() {
  try {
    await stat(paths.icons.base);
  } catch (error) {
    if (error.code === "ENOENT") {
      return;
    }

    throw error;
  }

  const sources = [];

  for await (const file of gulp.src(paths.icons.src, {
    base: paths.icons.base,
    read: false,
  })) {
    sources.push(file.path);
  }

  if (!sources.length) {
    return;
  }

  await pipeline(
    gulp.src(sources, {
      base: paths.icons.base,
      encoding: false,
    }),
    prepareIcons,
    svgSprite(spriteConfig),
    gulp.dest(paths.icons.dest).resume(),
  );
}

export const icons = withErrorHandling("icons", buildIcons);
