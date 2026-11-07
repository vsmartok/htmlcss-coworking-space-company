import { pipeline } from "node:stream/promises";
import gulp from "gulp";
import { paths } from "../paths.js";
import { withErrorHandling } from "../with-error-handling.js";
import { getExistingSourceGroups } from "../existing-source-groups.js";

async function buildVideo() {
  const groups = await getExistingSourceGroups(paths.video);

  await Promise.all(
    groups.map((group) =>
      pipeline(
        gulp.src(group.src, {
          base: group.base,
          encoding: false,
        }),
        gulp.dest(group.dest).resume(),
      ),
    ),
  );
}

export const video = withErrorHandling("video", buildVideo);
