import { readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";

export function loadData(directory) {
  const entries = readdirSync(directory, { withFileTypes: true });

  return Object.fromEntries(
    entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
      .map((entry) => {
        const filePath = join(directory, entry.name);
        const key = basename(entry.name, ".json");

        try {
          const content = readFileSync(filePath, "utf8");

          return [key, JSON.parse(content)];
        } catch (error) {
          throw new Error(`Failed to load data: ${filePath}`, { cause: error });
        }
      }),
  );
}
