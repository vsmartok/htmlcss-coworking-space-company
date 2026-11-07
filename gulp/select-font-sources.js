import { stat } from "node:fs/promises";
import gulp from "gulp";

export async function selectFontSources(group) {
  try {
    await stat(group.base);
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }

    throw error;
  }

  const outputs = new Map();

  for await (const file of gulp.src(group.src, {
    base: group.base,
    read: false,
  })) {
    const outputName = file.relative.replace(/\.(ttf|otf|woff2?)$/i, ".woff2");

    if (!outputs.has(outputName)) {
      outputs.set(outputName, []);
    }

    outputs.get(outputName).push(file);
  }

  const sources = [];

  for (const [outputName, files] of outputs) {
    const readyFonts = files.filter(
      (file) => file.extname.toLowerCase() === ".woff2",
    );

    const candidates = readyFonts.length ? readyFonts : files;

    if (candidates.length > 1) {
      const names = candidates.map((file) => `"${file.relative}"`).join(", ");

      throw new Error(
        `Font name conflict in ${group.base}: ` +
          `${names} all produce "${outputName}"`,
      );
    }

    sources.push(candidates[0].path);
  }

  return sources;
}
