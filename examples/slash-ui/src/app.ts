import { html, render } from "@_bashell/slash/core";
import { createRouter, Router, type RouterInstance } from "@_bashell/slash/router";
import { view } from "@_bashell/slash-ui/core";
import { exampleSite, htmlAttrs, renderPage, type SitePage, siteIndex } from "@_bashell/slash-ui/host";

// Site de exemplo do slash-ui no slash-spa: uma rota por página do kit. A cada navegação, o <html> recebe o tema,
// o modo e o idioma da página, e o título muda (o spa não tem API de head). `hash`: roteador em modo hash e links do
// conteúdo como #/caminho, para abrir de file:// (Capacitor/Tauri).

export interface SiteMount {
  router: RouterInstance;
  pages: SitePage[];
}

const INDEX_THEME = { theme: "brisa", mode: "light", lang: "pt-BR" };

/** O <html> (tema, modo, idioma) e o título da página; sem página, os do índice (ou do 404, pelo fallbackTitle). */
export function applyPage(
  page: Pick<SitePage, "lang" | "theme" | "mode" | "title"> | undefined,
  fallbackTitle = "slash-ui: site de exemplo",
): void {
  const attrs = page
    ? htmlAttrs(page as SitePage)
    : { lang: INDEX_THEME.lang, "data-theme": INDEX_THEME.theme, "data-mode": INDEX_THEME.mode };
  for (const [name, value] of Object.entries(attrs)) document.documentElement.setAttribute(name, value);
  document.title = page?.title ?? fallbackTitle;
}

export function mountSite(root: Element, opts: { hash: boolean; initialPath?: string }): SiteMount {
  const link = opts.hash ? (path: string) => `#${path}` : (path: string) => path;
  const pages = exampleSite(opts.hash ? { link } : {});
  const router = createRouter({
    routes: [
      { path: "/", component: () => siteIndex(pages, link) },
      ...pages.map((page) => ({ path: page.path, component: () => renderPage(page), meta: { page: page.path } })),
      { path: "/404", component: () => view`<main><h1>Página não encontrada</h1></main>`, meta: { notFound: true } },
    ],
    mode: opts.hash ? "hash" : "history",
    fallback: "/404",
    initialPath: opts.initialPath,
  });
  const sync = () => {
    const { meta } = router.get();
    applyPage(
      pages.find((page) => page.path === meta.page),
      meta.notFound ? "Página não encontrada" : undefined,
    );
  };
  router.watch(sync);
  sync();
  render(html`<${Router} router=${router} />`, root);
  return { router, pages };
}
