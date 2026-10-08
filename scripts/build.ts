// apps/playground/scripts/build.ts
import { cssModuleTypesPlugin } from "../plugins/css-types";
import { resolve } from "node:path";
import { cp, rm, mkdir } from "node:fs/promises";

type BuildConfig = Parameters<typeof Bun.build>[0];

const ROOT = resolve(import.meta.dir, "..");
const DIST = resolve(ROOT, "dist");
const PUBLIC = resolve(ROOT, "public");

// Limpar dist/
console.log("[build] Cleaning dist/...");
await rm(DIST, { recursive: true, force: true });
await mkdir(DIST, { recursive: true });

const buildConfig = {
  entrypoints: [resolve(ROOT, "src/client.ts")],
  outdir: DIST,
  splitting: true,
  sourcemap: "external", // sourcemaps externos para produção
  minify: true, // minifica para reduzir tamanho
  format: "esm",
  naming: {
    entry: "[dir]/[name]-[hash].[ext]", // hash para cache busting
    chunk: "[dir]/[name]-[hash].[ext]",
    asset: "[dir]/[name]-[hash].[ext]",
  },
  plugins: [cssModuleTypesPlugin({ verbose: false })],
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
    __DEV__: "false", // flag de desenvolvimento desativado
  },
} satisfies BuildConfig;

console.log("[build] Building client for production...");

const startTime = performance.now();
const result = await Bun.build(buildConfig);

if (!result.success) {
  console.error("[build] ❌ Build failed:");
  for (const log of result.logs) {
    console.error(log);
  }
  process.exit(1);
}

// Copiar arquivos estáticos de public/ para dist/
console.log("[build] Copying static files from public/ to dist/...");
await cp(PUBLIC, DIST, { recursive: true, force: true });

const elapsed = (performance.now() - startTime).toFixed(0);
const totalSize = result.outputs.reduce((sum, o) => sum + (o.size || 0), 0);
const totalSizeKB = (totalSize / 1024).toFixed(1);

console.log(`[build] ✓ Built ${result.outputs.length} files in ${elapsed}ms (${totalSizeKB}KB total)`);

// Lista os arquivos gerados com tamanhos
for (const output of result.outputs) {
  const path = output.path.replace(process.cwd(), ".");
  const sizeKB = ((output.size || 0) / 1024).toFixed(1);
  console.log(`  - ${path} (${sizeKB}KB)`);
}

console.log("[build] ✓ Static files copied to dist/");
