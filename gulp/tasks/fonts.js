import { pipeline } from "node:stream/promises";
import gulp from "gulp";
import { paths } from "../paths.js";
import { withErrorHandling } from "../with-error-handling.js";
import { selectFontSources } from "../select-font-sources.js";
import { convertFonts } from "../convert-fonts.js";

async function buildFonts() {
  const sources = await selectFontSources(paths.fonts);

  if (!sources.length) {
    return;
  }

  await pipeline(
    gulp.src(sources, {
      base: paths.fonts.base,
      encoding: false,
    }),
    convertFonts,
    gulp.dest(paths.fonts.dest).resume(),
  );
}

export const fonts = withErrorHandling("fonts", buildFonts);
