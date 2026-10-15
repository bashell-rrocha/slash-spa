# Hospedeiro de exemplo do slash-ui (slash-spa)

As telas de exemplo do `@_bashell/slash-ui` num spa com o roteador do Slash: as 4 landings e o app Sereno (cada
estado e cada lembrete), como PWA. É a prova de nível 3 do kit: as mesmas páginas rodam iguais em slash-ssg,
slash-spa e slash-ssr (`bun run test:hosts` no `slash-ui`).

- `bun run ui:build`: gera `examples/slash-ui/dist/` (módulo ES, CSS dos temas com as fontes, ícones, manifest e
  service worker do app).
- `bun run ui:build:file`: gera `examples/slash-ui/dist-file/` para abrir de `file://` (Capacitor/Tauri): IIFE,
  caminhos relativos e roteador em modo hash, sem service worker.
- `PORT=4402 bun run ui:serve`: serve o `dist/` (toda rota devolve o `index.html`).

A cada navegação, o `<html>` recebe o tema, o modo e o idioma da página, e o título muda (`src/app.ts`).
