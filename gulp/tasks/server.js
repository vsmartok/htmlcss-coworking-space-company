import browserSync from "browser-sync";
import { paths } from "../paths.js";

export const server = browserSync.create();

export function serve(done) {
  server.init(
    {
      server: {
        baseDir: paths.build,
      },
      port: 3000,
      listen: "0.0.0.0",
      open: false,
      ui: false,
      notify: false,
      middleware: [
        function disableCache(req, res, next) {
          res.setHeader("Cache-Control", "no-store");
          next();
        },
      ],
    },
    done,
  );
}
