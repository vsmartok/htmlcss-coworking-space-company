import { pipeline } from "node:stream/promises";
import gulp from "gulp";
import * as dartSass from "sass";
import gulpSass from "gulp-sass";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import rename from "gulp-rename";
import { paths } from "../paths.js";
import { config } from "../config.js";
import { withErrorHandling } from "../with-error-handling.js";

const sass = gulpSass(dartSass);

async function buildCss() {
  const streams = [
    gulp.src(paths.css.src, {
      base: paths.css.base,
      sourcemaps: config.isDev,
    }),
    sass.sync({ style: "expanded" }),
    postcss([autoprefixer()]),
  ];

  if (config.isProd) {
    streams.push(
      gulp.dest(paths.css.dest),
      postcss([cssnano()]),
      rename({ suffix: ".min" }),
    );
  }

  streams.push(
    gulp
      .dest(paths.css.dest, {
        sourcemaps: config.isDev ? "." : false,
      })
      .resume(),
  );

  await pipeline(...streams);
}

export const css = withErrorHandling("css", buildCss);
