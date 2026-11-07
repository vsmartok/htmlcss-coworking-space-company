import { config } from "./config.js";

export function withErrorHandling(name, task) {
  async function wrappedTask() {
    try {
      await task();
      return true;
    } catch (error) {
      if (config.isProd) {
        throw error;
      }

      console.error(`[${name}] Build failed:`);
      console.error(error);

      return false;
    }
  }

  wrappedTask.displayName = name;

  return wrappedTask;
}
