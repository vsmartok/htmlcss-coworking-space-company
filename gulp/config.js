const isProd = process.argv.includes("--production");

export const config = {
  isProd,
  isDev: !isProd,
};
