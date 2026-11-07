import { pipeline } from "node:stream/promises";
import gulp from "gulp";
import { paths } from "../paths.js";
import { withErrorHandling } from "../with-error-handling.js";
import { checkImageNames } from "../check-image-names.js";
import { createWebp } from "../create-webp.js";
import { optimizeSvg } from "../optimize-svg.js";
import { optimizeRaster } from "../optimize-raster.js";
import { getExistingSourceGroups } from "../existing-source-groups.js";

async function buildImages() {
  const groups = await getExistingSourceGroups(paths.images);

  for (const group of groups) {
    await checkImageNames(group);
  }

  await Promise.all(
    groups.map((group) =>
      pipeline(
        gulp.src(group.src, {
          base: group.base,
          encoding: false,
          nocase: true,
        }),
        createWebp,
        optimizeRaster,
        optimizeSvg,
        gulp.dest(group.dest).resume(),
      ),
    ),
  );
}

export const images = withErrorHandling("images", buildImages);
