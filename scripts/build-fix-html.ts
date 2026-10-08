// Fix index.html to reference hashed files
import { resolve } from "node:path";
import { readFile, writeFile } from "node:fs/promises";
import { readdirSync } from "node:fs";

const DIST = resolve(import.meta.dir, "../dist");

// Find hashed files
const files = readdirSync(DIST);
const jsFile = files.find(f => f.startsWith("client-") && f.endsWith(".js") && !f.endsWith(".map"));
const cssFile = files.find(f => f.startsWith("client-") && f.endsWith(".css"));

if (!jsFile) {
  console.error("[fix-html] No JS file found!");
  process.exit(1);
}

// Update index.html
const indexPath = resolve(DIST, "index.html");
let html = await readFile(indexPath, "utf-8");

html = html.replace("/client.js", `/${jsFile}`);

if (cssFile && !html.includes(cssFile)) {
  html = html.replace("</head>", `  <link rel="stylesheet" href="/${cssFile}">\n  </head>`);
}

await writeFile(indexPath, html, "utf-8");
console.log(`[fix-html] Updated index.html with hashed filenames`);
