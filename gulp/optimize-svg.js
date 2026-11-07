import { optimize } from "svgo";
import { config } from "./config.js";

export async function* optimizeSvg(files) {
  for await (const file of files) {
    if (!config.isProd || !/^\.svg$/i.test(file.extname)) {
      yield file;
      continue;
    }

    try {
      const result = optimize(file.contents.toString("utf8"), {
        path: file.path,
        multipass: true,
        plugins: [
          {
            name: "preset-default",
            params: {
              overrides: {
                cleanupIds: false,
                removeDesc: false,
              },
            },
          },
        ],
      });

      const contents = Buffer.from(result.data);

      if (contents.length < file.contents.length) {
        file.contents = contents;
      }

      yield file;
    } catch (error) {
      throw new Error(`Failed to optimize SVG: ${file.relative}`, {
        cause: error,
      });
    }
  }
}
