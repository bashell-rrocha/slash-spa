import { EXAMPLE_APP, exampleSite, serviceWorkerSource, webManifest } from "@_bashell/slash-ui/host";
import { copyHostAssets, themeColors } from "@_bashell/slash-ui/host/node";
import { mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { cssModuleTypesPlugin } from "../../plugins/css-types";

// Build do site de exemplo do slash-ui no slash-spa: o cliente (Bun.build, como o template), o CSS dos temas com as
// fontes, os ícones e o index.html. Em http (padrão): módulo ES com hash, manifest e service worker do app. Com
// --file: IIFE e caminhos relativos para abrir de file:// (Capacitor/Tauri), roteador em modo hash, sem PWA.
// Uso: bun run ui:build  |  bun run ui:build:file   (saída em examples/slash-ui/dist/ ou dist-file/)

const ROOT = import.meta.dir;
const FILE = process.argv.includes("--file");
const OUT = join(ROOT, FILE ? "dist-file" : "dist");
const base = FILE ? "./" : "/";
const pages = exampleSite();

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
const result = await Bun.build({
  entrypoints: [join(ROOT, "src", "client.ts")],
  outdir: OUT,
  target: "browser",
  format: FILE ? "iife" : "esm",
  splitting: !FILE,
  minify: true,
  naming: FILE ? "[name].[ext]" : "[name]-[hash].[ext]",
  define: {
    __DEV__: "false",
    __HASH__: String(FILE),
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  plugins: [cssModuleTypesPlugin({ verbose: false })],
});
if (!result.success) {
  console.error(result.logs.map((log) => log.message).join("\n"));
  process.exit(1);
}
const outputs = result.outputs.map((o) => relative(OUT, o.path));
const entry = relative(OUT, (result.outputs.find((o) => o.kind === "entry-point") ?? result.outputs[0]).path);
const bundleCss = outputs.filter((file) => file.endsWith(".css"));

// Os temas de todas as páginas (o CSS de cada um tem escopo [data-theme]: a página troca pelo atributo)
const themes = [...new Set(pages.map((p) => p.theme))];
const themeCss = copyHostAssets(OUT, themes);
const colors = themeColors(EXAMPLE_APP.theme);
const css = [...themeCss, ...bundleCss].map((href) => `<link rel="stylesheet" href="${base}${href}">`);
const pwa = FILE
  ? []
  : [`<link rel="manifest" href="/app/manifest.webmanifest">`, `<meta name="theme-color" content="${colors.theme}">`];
const script = FILE ? `<script defer src="./${entry}"></script>` : `<script type="module" src="/${entry}"></script>`;
writeFileSync(
  join(OUT, "index.html"),
  `<!doctype html>
<html lang="pt-BR" data-theme="${EXAMPLE_APP.theme}" data-mode="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>slash-ui: site de exemplo</title>
${[...css, ...pwa].join("\n")}
</head>
<body>
<div id="app"></div>
${script}
</body>
</html>
`,
);

if (!FILE) {
  const manifest = webManifest({
    ...EXAMPLE_APP,
    themeColor: colors.theme,
    backgroundColor: colors.background,
    icons: "/app/icons/",
  });
  mkdirSync(join(OUT, "app"), { recursive: true });
  writeFileSync(join(OUT, "app", "manifest.webmanifest"), JSON.stringify(manifest, null, 2));
  const files = (dir: string): string[] =>
    readdirSync(dir).flatMap((name) => {
      const path = join(dir, name);
      return statSync(path).isDirectory() ? files(path) : [`/${relative(OUT, path)}`];
    });
  const assets = files(OUT).filter(
    (file) =>
      (/^\/[\w-]+\.(css|js)$/.test(file) && !file.endsWith(".map")) ||
      file === "/themes/dist/base.css" ||
      file === `/themes/dist/${EXAMPLE_APP.theme}.css` ||
      file.startsWith(`/themes/${EXAMPLE_APP.theme}/fonts/`) ||
      file.startsWith("/app/icons/"),
  );
  // O servidor do spa devolve o index.html em toda rota: o pré-cache guarda cada rota do app com ele
  const precache = [...pages.filter((p) => p.app).map((p) => p.path), ...assets];
  writeFileSync(join(OUT, "app", "sw.js"), serviceWorkerSource({ precache, scope: EXAMPLE_APP.startUrl }));
}
console.log(
  `[ui:build${FILE ? ":file" : ""}] ${outputs.length} arquivos do bundle em ${relative(process.cwd(), OUT)}/`,
);
