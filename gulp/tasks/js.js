import { glob, mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { build, transform } from "esbuild";
import browserslistToEsbuild from "browserslist-to-esbuild";
import { paths } from "../paths.js";
import { config } from "../config.js";
import { withErrorHandling } from "../with-error-handling.js";

async function buildJs() {
  const entryPoints = await Array.fromAsync(glob(paths.js.src));

  if (entryPoints.length === 0) {
    return;
  }

  const target = browserslistToEsbuild();

  const result = await build({
    entryPoints,
    outbase: paths.js.base,
    outdir: paths.js.dest,
    bundle: true,
    platform: "browser",
    target,
    format: "iife",
    sourcemap: config.isDev ? "linked" : false,
    minify: false,
    write: false,
    logLevel: "silent",
  });

  for (const file of result.outputFiles) {
    await mkdir(dirname(file.path), { recursive: true });
    await writeFile(file.path, file.contents);

    if (config.isProd && file.path.endsWith(".js")) {
      const minified = await transform(file.text, {
        target,
        minify: true,
        legalComments: "eof",
        logLevel: "silent",
      });

      const minifiedPath = `${file.path.slice(0, -3)}.min.js`;

      await writeFile(minifiedPath, minified.code);
    }
  }
}

export const js = withErrorHandling("js", buildJs);
