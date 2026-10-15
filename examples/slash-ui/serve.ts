import { resolveStatic } from "@_bashell/slash-ui/host/node";
import { extname, join } from "node:path";

// Serve o site de exemplo (dist/) numa porta, como um spa: arquivo que existe, ele; rota (sem extensão), o
// index.html; codificação inválida → 400; caminho para fora do dist/ → 403 (resolveStatic, do kit).
// Uso: PORT=4402 bun run ui:serve

const DIST = join(import.meta.dir, "dist");
const port = Number(process.env.PORT ?? 4402);
const TYPES: Record<string, string> = { ".webmanifest": "application/manifest+json", ".js": "text/javascript" };

const server = Bun.serve({
  port,
  fetch(req) {
    const path = new URL(req.url).pathname;
    const found = resolveStatic(DIST, path);
    if ("file" in found) {
      const type = TYPES[extname(found.file)];
      return new Response(Bun.file(found.file), type ? { headers: { "content-type": type } } : undefined);
    }
    if (found.status !== 404)
      return new Response(found.status === 400 ? "endereço inválido" : "fora do site", { status: found.status });
    if (extname(path)) return new Response("não encontrado", { status: 404 });
    return new Response(Bun.file(join(DIST, "index.html")), {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  },
});
console.log(`[ui:serve] http://localhost:${server.port}/`);
