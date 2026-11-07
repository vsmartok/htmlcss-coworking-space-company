import { optimize } from "svgo";

export async function* prepareIcons(files) {
  for await (const file of files) {
    try {
      const result = optimize(file.contents.toString("utf8"), {
        path: file.path,
        plugins: [
          {
            name: "preset-default",
            params: {
              overrides: {
                cleanupIds: false,
                convertColors: {
                  currentColor:
                    /^(?!(?:none|inherit|currentColor|transparent)$|(?:url|var)\().+/i,
                },
              },
            },
          },
        ],
      });

      file.contents = Buffer.from(result.data);

      yield file;
    } catch (error) {
      throw new Error(`Failed to prepare icon: ${file.relative}`, {
        cause: error,
      });
    }
  }
}
