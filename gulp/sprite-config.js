export const spriteConfig = {
  shape: {
    id: {
      generator: (name) => name.replace(/\.svg$/i, "").replace(/[\\/]/g, "--"),
    },
    transform: [],
  },
  svg: {
    xmlDeclaration: false,
    doctypeDeclaration: false,
    namespaceIDs: true,
    namespaceClassnames: true,
  },
  mode: {
    symbol: {
      dest: ".",
      sprite: "sprite.svg",
      inline: false,
      example: false,
    },
  },
};
