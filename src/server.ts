// apps/playground/src/server.ts
const DIST = new URL("../dist/", import.meta.url);
const INDEX = new URL("../dist/index.html", import.meta.url);
const MANIFEST = new URL("../dist/.css-dev.json", import.meta.url);

function injectCss(html: string, css: string[]): string {
  if (!css.length) return html;
  const links = css
    .filter(name => !html.includes(name)) // evita duplicar se já tiver manual
    .map(name => `<link rel="stylesheet" href="/${name}">`)
    .join("");
  // injeta antes de </head> (ou no topo se não tiver head)
  if (html.includes("</head>")) {
    return html.replace("</head>", `${links}\n</head>`);
  }
  return links + html;
}

async function serveIndex(): Promise<Response> {
  const file = Bun.file(INDEX);
  let html = await file.text();

  // lê manifest do dev (se existir) e injeta os <link>
  try {
    const json = await Bun.file(MANIFEST).json() as { css?: string[] };
    html = injectCss(html, json.css ?? []);
  } catch {
    // sem manifest: segue sem injetar
  }

  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}

Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === "/" || url.pathname === "/index.html") {
      return serveIndex();
    }
    // estático da pasta dist
    try {
      const fileUrl = new URL("." + url.pathname, DIST);
      const file = Bun.file(fileUrl);
      if (await file.exists()) return new Response(file);
      // SPA fallback: retorna index.html para rotas não encontradas
      return serveIndex();
    } catch {
      // SPA fallback: retorna index.html em caso de erro
      return serveIndex();
    }
  }
});

console.log("▶ http://localhost:3000");

