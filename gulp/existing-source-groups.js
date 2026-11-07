import { stat } from "node:fs/promises";

export async function getExistingSourceGroups(groups) {
  const existing = [];

  for (const group of groups) {
    try {
      await stat(group.base);
      existing.push(group);
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error;
      }
    }
  }

  return existing;
}
