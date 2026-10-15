import { existsSync, statSync } from "node:fs";
import { extname, join } from "node:path";

// Serve o site de exemplo (dist/) numa porta, como um spa: arquivo que existe, ele; rota (sem extensão), o index.html.
// Uso: PORT=4402 bun run ui:serve

const DIST = join(import.meta.dir, "dist");
const port = Number(process.env.PORT ?? 4402);
const TYPES: Record<string, string> = { ".webmanifest": "application/manifest+json", ".js": "text/javascript" };

const server = Bun.serve({
  port,
  fetch(req) {
    const path = join(DIST, decodeURIComponent(new URL(req.url).pathname));
    if (!path.startsWith(DIST)) return new Response("fora do site", { status: 403 });
    if (existsSync(path) && statSync(path).isFile()) {
      const type = TYPES[extname(path)];
      return new Response(Bun.file(path), type ? { headers: { "content-type": type } } : undefined);
    }
    if (extname(path)) return new Response("não encontrado", { status: 404 });
    return new Response(Bun.file(join(DIST, "index.html")), {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  },
});
console.log(`[ui:serve] http://localhost:${server.port}/`);
