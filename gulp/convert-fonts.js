import fontverter from "fontverter";

export async function* convertFonts(files) {
  for await (const file of files) {
    try {
      if (file.extname.toLowerCase() !== ".woff2") {
        file.contents = await fontverter.convert(file.contents, "woff2");
      }

      file.extname = ".woff2";

      yield file;
    } catch (error) {
      throw new Error(`Failed to convert font: ${file.relative}`, {
        cause: error,
      });
    }
  }
}
