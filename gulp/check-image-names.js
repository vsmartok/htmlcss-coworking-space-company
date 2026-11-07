import gulp from "gulp";

export async function checkImageNames(group) {
  const files = [];

  for await (const file of gulp.src(group.src, {
    base: group.base,
    read: false,
    nocase: true,
  })) {
    files.push(file.relative);
  }

  const outputs = new Map(files.map((name) => [name, name]));

  for (const name of files) {
    if (!/\.(jpe?g|png)$/i.test(name)) {
      continue;
    }

    const webpName = name.replace(/\.(jpe?g|png)$/i, ".webp");

    if (outputs.has(webpName)) {
      throw new Error(
        `Image name conflict in ${group.base}: ` +
          `"${name}" and "${outputs.get(webpName)}" ` +
          `both produce "${webpName}"`,
      );
    }

    outputs.set(webpName, name);
  }
}
