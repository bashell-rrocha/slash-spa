import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

// Build do site de exemplo do slash-ui no slash-spa: em http (módulo ES, PWA) e para file:// (IIFE, caminhos
// relativos, sem service worker).

const ROOT = import.meta.dir;
const build = async (...args: string[]) => {
  const proc = Bun.spawn(["bun", "run", join(ROOT, "build.ts"), ...args], { stdout: "pipe", stderr: "pipe" });
  const [stderr, code] = await Promise.all([new Response(proc.stderr).text(), proc.exited]);
  return { code, stderr };
};

describe("ui:build (slash-spa)", async () => {
  const http = await build();
  const file = await build("--file");
  const index = readFileSync(join(ROOT, "dist", "index.html"), "utf8");
  const fileIndex = readFileSync(join(ROOT, "dist-file", "index.html"), "utf8");

  test("os dois builds terminam sem erro", () => {
    expect([http.code, file.code]).toEqual([0, 0]);
  });

  test("http: base.css antes dos temas, o CSS do bundle depois, manifest e módulo ES", () => {
    // Arrange
    const links = [...index.matchAll(/<link rel="stylesheet" href="([^"]+)">/g)].map((m) => m[1] as string);

    // Act
    const order = links.map((href) => href.replace(/^\/client-\w+\.css$/, "/client.css"));

    // Assert
    expect(order).toEqual([
      "/themes/dist/base.css",
      "/themes/dist/ambar-dev.css",
      "/themes/dist/brisa.css",
      "/themes/dist/ameixa.css",
      "/themes/dist/petroleo.css",
      "/client.css",
    ]);
    expect(index).toContain('<link rel="manifest" href="/app/manifest.webmanifest">');
    expect(index).toMatch(/<script type="module" src="\/client-[\w]+\.js"><\/script>/);
    expect(index).toContain('<div id="app"></div>');
    expect(existsSync(join(ROOT, "dist", "app", "sw.js"))).toBe(true);
  });

  test("file://: script clássico e caminhos relativos, sem manifest nem service worker", () => {
    // Arrange / Act
    const absolute = [...fileIndex.matchAll(/(?:href|src)="(\/[^"]*)"/g)].map((m) => m[1]);

    // Assert
    expect(absolute).toEqual([]);
    expect(fileIndex).toContain('<script defer src="./client.js"></script>');
    expect(fileIndex).not.toContain("manifest");
    expect(existsSync(join(ROOT, "dist-file", "app", "sw.js"))).toBe(false);
    expect(readFileSync(join(ROOT, "dist-file", "client.js"), "utf8")).not.toMatch(/^import |\bexport \{/m);
  });
});
