// apps/playground/scripts/dev.ts
import { cssModuleTypesPlugin } from "../plugins/css-types";
import { watch as fsWatch } from "node:fs";
import { stat, readdir, writeFile, cp, rm, mkdir } from "node:fs/promises";
import { resolve, join, extname, basename } from "node:path";
import type { BunPlugin } from "bun";

type BuildConfig = Parameters<typeof Bun.build>[0];

const ROOT = resolve(import.meta.dir, "..");
const DIST = resolve(ROOT, "dist");
const PUBLIC = resolve(ROOT, "public");
const SRC = resolve(ROOT, "src");
const MANIFEST = join(DIST, ".css-dev.json");

// Plugin para resolver "slash" para o código fonte TypeScript em desenvolvimento
const resolveSlashSourcePlugin: BunPlugin = {
  name: "resolve-slash-source",
  setup(build) {
    // Resolve "slash" para o source
    build.onResolve({ filter: /^slash$/ }, () => {
      return {
        path: resolve(import.meta.dir, "../../slash/src/index.ts"),
      };
    });
    // Resolve "slash/router" para o source
    build.onResolve({ filter: /^slash\/router$/ }, () => {
      return {
        path: resolve(import.meta.dir, "../../slash/src/router/index.ts"),
      };
    });
  },
};

const buildConfig = {
  entrypoints: [resolve(SRC, "client.ts")],
  outdir: DIST,
  splitting: true,
  sourcemap: "inline", // sourcemaps inline para debug no browser
  minify: false, // código legível em desenvolvimento
  format: "esm",
  naming: {
    entry: "[dir]/[name].[ext]", // nomes legíveis (sem hash)
    chunk: "[dir]/[name].[ext]",
    asset: "[dir]/[name].[ext]",
  },
  external: [],
  plugins: [resolveSlashSourcePlugin, cssModuleTypesPlugin({ verbose: true })],
  define: {
    "process.env.NODE_ENV": JSON.stringify("development"),
    __DEV__: "true", // flag útil para código condicional
  },
} satisfies BuildConfig;

// extensões que disparam rebuild (ignora .d.ts)
const VALID_EXT = new Set([".ts", ".tsx", ".js", ".jsx", ".css"]);

// Inicializar dist/ e copiar arquivos estáticos
console.log("[dev] Initializing dist/...");
await rm(DIST, { recursive: true, force: true });
await mkdir(DIST, { recursive: true });
await cp(PUBLIC, DIST, { recursive: true });

await buildOnce("initial");

// watcher: macOS/Win usa recursive, Linux cai em polling
if (supportsRecursiveWatch()) {
  console.log("[playground] watching (fs.watch recursive)");
  const w = fsWatch(SRC, { recursive: true }, (_event, filename) => {
    if (!filename) return;
    const full = join(SRC, filename.toString());
    if (!isWatchedFile(full)) return;
    void buildOnce(`change ${filename}`);
  });
  process.on("SIGINT", () => { w.close(); process.exit(0); });
} else {
  console.log("[playground] watching (polling)");
  const mtimes = new Map<string, number>();
  const tick = async () => {
    for await (const file of walk(SRC)) {
      if (!isWatchedFile(file)) continue;
      try {
        const m = (await stat(file)).mtimeMs;
        const prev = mtimes.get(file) ?? 0;
        if (m !== prev) {
          mtimes.set(file, m);
          await buildOnce(`change ${file}`);
        }
      } catch {}
    }
    // limpa deletados
    for (const f of Array.from(mtimes.keys())) {
      try { await stat(f); } catch { mtimes.delete(f); }
    }
  };
  const interval = setInterval(tick, 800);
  process.on("SIGINT", () => { clearInterval(interval); process.exit(0); });
}

// sobe o servidor e mantém o processo vivo
await import("../src/server");

/* ---------------- utils ---------------- */

function supportsRecursiveWatch() {
  return process.platform === "darwin" || process.platform === "win32";
}
function isWatchedFile(path: string) {
  const ext = extname(path).toLowerCase();
  if (ext === ".d.ts") return false; // evita loop por tipos gerados
  return VALID_EXT.has(ext);
}
async function* walk(dir: string): AsyncGenerator<string> {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) yield* walk(full);
    else yield full;
  }
}

// roda a build, escreve manifest com os CSS gerados
async function buildOnce(tag: string) {
  const startTime = performance.now();
  const result = await Bun.build(buildConfig);

  if (!result.success) {
    console.error(`[playground] ❌ Build failed ${tag ? `(${tag})` : ""}:`);
    for (const log of result.logs) {
      console.error(log);
    }
    return;
  }

  await writeCssManifestFromOutputs(result?.outputs ?? []);

  // Copiar arquivos estáticos após cada build
  if (tag !== "initial") {
    await cp(PUBLIC, DIST, { recursive: true, force: true });
  }

  const elapsed = (performance.now() - startTime).toFixed(0);
  const totalSize = result.outputs.reduce((sum, o) => sum + (o.size || 0), 0);
  const sizeKB = (totalSize / 1024).toFixed(1);

  console.log(`[playground] ✓ client built ${tag ? `(${tag})` : ""} in ${elapsed}ms (${sizeKB}KB)`);

  // Log detalhado dos arquivos gerados (útil para debug)
  if (tag === "initial") {
    for (const output of result.outputs) {
      const name = basename(output.path);
      const size = ((output.size || 0) / 1024).toFixed(1);
      console.log(`  - ${name} (${size}KB)`);
    }
  }
}

async function writeCssManifestFromOutputs(outputs: any[]) {
  // pega todos os outputs .css desse build
  const cssFiles = outputs
    .map(o => String(o?.path || ""))
    .filter(p => p.endsWith(".css"))
    .map(p => basename(p));

  // escreve o manifest só se mudou (evita tocar mtime)
  const payload = JSON.stringify({ css: cssFiles }, null, 2);
  try {
    const current = await Bun.file(MANIFEST).text();
    if (current === payload) return;
  } catch {}
  await writeFile(MANIFEST, payload, "utf8");
}

