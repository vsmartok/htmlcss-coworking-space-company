const build = "./build";

const imageFormats =
  "{jpg,JPG,jpeg,JPEG,png,PNG,gif,GIF,svg,SVG,webp,WEBP,avif,AVIF}";

export const paths = {
  build,
  html: {
    src: ["./src/html/**/*.njk", "!./src/html/**/_*/**/*.njk"],
    base: "./src/html",
    dest: build,
    data: "./src/html/_data",
    watch: ["./src/html/**/*.njk", "./src/html/_data/*.json"],
  },
  css: {
    src: [
      "./src/css/**/*.{sass,scss,css}",
      "!./src/css/**/_*.{sass,scss,css}",
      "!./src/css/vendors/**",
    ],
    base: "./src/css",
    dest: `${build}/assets/css`,
    watch: "./src/css/**/*.{sass,scss,css}",
  },
  js: {
    src: "./src/js/*.js",
    base: "./src/js",
    dest: `${build}/assets/js`,
    watch: "./src/js/**/*.js",
  },
  images: [
    {
      src: `./src/img/**/*.${imageFormats}`,
      base: "./src/img",
      dest: `${build}/assets/img`,
    },
    {
      src: `./src/uploads/images/**/*.${imageFormats}`,
      base: "./src/uploads/images",
      dest: `${build}/uploads/images`,
    },
  ],
  video: [
    {
      src: "./src/video/**/*",
      base: "./src/video",
      dest: `${build}/assets/video`,
    },
    {
      src: "./src/uploads/videos/**/*",
      base: "./src/uploads/videos",
      dest: `${build}/uploads/videos`,
    },
  ],
  fonts: {
    src: "./src/fonts/**/*.{ttf,TTF,otf,OTF,woff,WOFF,woff2,WOFF2}",
    base: "./src/fonts",
    dest: `${build}/assets/fonts`,
  },
  icons: {
    src: "./src/icons/**/*.{svg,SVG}",
    base: "./src/icons",
    dest: `${build}/assets/icons`,
  },
  public: {
    src: "./src/public/**/*",
    base: "./src/public",
    dest: build,
  },
};
