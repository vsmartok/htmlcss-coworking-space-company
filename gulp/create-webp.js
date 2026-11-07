import sharp from "sharp";

export async function* createWebp(files) {
  for await (const file of files) {
    if (!/\.(jpe?g|png)$/i.test(file.extname)) {
      yield file;
      continue;
    }

    try {
      const contents = await sharp(file.contents, {
        animated: true,
      })
        .keepExif()
        .webp({
          quality: 80,
          lossless: /\.png$/i.test(file.extname),
        })
        .toBuffer();

      const webpFile = file.clone({ contents: false });

      webpFile.extname = ".webp";
      webpFile.contents = contents;

      yield file;
      yield webpFile;
    } catch (error) {
      throw new Error(`Failed to create WebP: ${file.relative}`, {
        cause: error,
      });
    }
  }
}
