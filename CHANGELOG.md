# Changelog

Todas as mudanças relevantes deste projeto são registradas aqui, seguindo [Conventional Commits](https://www.conventionalcommits.org/) e [SemVer](https://semver.org/).

## [0.0.3] — 2026-10-15

Compatível com `@_bashell/slash` 0.0.6 (npm). O template roda fora do monorepo `slash-meta` só com o core publicado.

### Adicionado

- Pipeline de testes no GitHub Actions (`.github/workflows/test.yml`): em todo PR para `develop` ou `main` e no push na
  `main`, `bun install --frozen-lockfile`, `test`, `typecheck` e `test:e2e` (relatório do Playwright guardado quando
  falha). `bun.lock` versionado; o README explica como regerar.
- `PORT` validada (`src/port.ts`, inteiro de 1 a 65535; valor inválido encerra com erro em português); o servidor
  anuncia a porta real, e o Playwright usa a mesma `PORT`.
- README com os comandos.

### Alterado

- `@_bashell/slash` pela versão publicada (`^0.0.6`), não mais `workspace:*`; `@types/bun` fixo (1.4.3).
- Testes e2e com caminhos relativos (sem `localhost:3000` fixo).

### Removido

- Alias de `bunfig.toml` para o código do core no monorepo (nada o usava).
- Arquivos de teste soltos (`test-build/`, `test-form-simple.html`) e cabeçalhos de caminho antigos.

## [0.0.2] — 2026-10-08

Compatível com `@_bashell/slash` 0.0.3 (seguro por padrão).

### Corrigido

- `bun run start` servia página em branco: o build de produção agora reescreve o `index.html` com os assets com hash (e falha se não conseguir).
- E2E: os testes `*.e2e.ts` passam a rodar; novo teste de navegação pelos links; 4 testes antigos corrigidos; o filtro de status ganhou `<label for>` associado ao `<select>`.

### Removido

- Plugin de dev `resolve-slash-source` (morto e dependente de caminhos do monorepo).

## [0.0.1] — 2026-10-08

Primeira versão pública do `slash-spa`.
