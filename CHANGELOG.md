# Changelog

Todas as mudanças relevantes deste projeto são registradas aqui, seguindo [Conventional Commits](https://www.conventionalcommits.org/) e [SemVer](https://semver.org/).

## [0.0.2] — 2026-10-08

Compatível com `@_bashell/slash` 0.0.3 (seguro por padrão).

### Corrigido

- `bun run start` servia página em branco: o build de produção agora reescreve o `index.html` com os assets com hash (e falha se não conseguir).
- E2E: os testes `*.e2e.ts` passam a rodar; novo teste de navegação pelos links; 4 testes antigos corrigidos; o filtro de status ganhou `<label for>` associado ao `<select>`.

### Removido

- Plugin de dev `resolve-slash-source` (morto e dependente de caminhos do monorepo).

## [0.0.1] — 2026-10-08

Primeira versão pública do `slash-spa`.
