import sharp from "sharp";
import { config } from "./config.js";

export async function* optimizeRaster(files) {
  for await (const file of files) {
    if (!config.isProd || !/\.(jpe?g|png)$/i.test(file.extname)) {
      yield file;
      continue;
    }

    try {
      const image = sharp(file.contents, {
        animated: true,
      }).keepMetadata();

      if (/\.png$/i.test(file.extname)) {
        const metadata = await image.metadata();

        if (metadata.depth === "ushort") {
          image.toColourspace("rgb16");
        }

        image.png({
          compressionLevel: 9,
          adaptiveFiltering: true,
          palette: false,
        });
      } else {
        image.jpeg({
          quality: 85,
          progressive: true,
          mozjpeg: true,
        });
      }

      const contents = await image.toBuffer();

      if (contents.length < file.contents.length) {
        file.contents = contents;
      }

      yield file;
    } catch (error) {
      throw new Error(`Failed to optimize image: ${file.relative}`, {
        cause: error,
      });
    }
  }
}
