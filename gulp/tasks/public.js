import { stat } from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import gulp from "gulp";
import { paths } from "../paths.js";
import { withErrorHandling } from "../with-error-handling.js";

async function copyPublic() {
  try {
    await stat(paths.public.base);
  } catch (error) {
    if (error.code === "ENOENT") {
      return;
    }

    throw error;
  }

  await pipeline(
    gulp.src(paths.public.src, {
      base: paths.public.base,
      encoding: false,
    }),
    gulp.dest(paths.public.dest).resume(),
  );
}

export const publicAssets = withErrorHandling("public", copyPublic);
