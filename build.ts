import { build } from "bun";

// Build the React app
await build({
  entrypoints: ["./src/main.tsx"],
  outdir: "./dist",
  target: "browser",
  minify: true,
  sourcemap: "external",
});

// Copy HTML file to dist
const html = await Bun.file("./src/index.html").text();
await Bun.write("./dist/index.html", html);

// Copy CSS file to dist
const css = await Bun.file("./src/index.css").text();
await Bun.write("./dist/index.css", html.replace('</head>', `<link rel="stylesheet" href="./index.css">\n</head>`));

console.log("Build complete! Files are in ./dist"); 