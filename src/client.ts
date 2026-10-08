// Importar apenas o necessário usando subpaths otimizados
import { html, render } from "@_bashell/slash/core";
import { createRouter, Router } from "@_bashell/slash/router";
import { Dashboard } from "./pages/Dashboard";
import { Tasks } from "./pages/Tasks";
import { TaskEdit } from "./pages/TaskEdit";
import { TaskNew } from "./pages/TaskNew";
import { NotFound } from "./pages/NotFound";

if (__DEV__) {
  console.log("[DEV] Task Manager iniciando em modo desenvolvimento");
  console.log("[DEV] Ambiente:", process.env.NODE_ENV);
}

// Create router with routes
const router = createRouter({
  routes: [
    { path: "/", component: () => Dashboard() },
    { path: "/tasks", component: () => Tasks() },
    { path: "/tasks/new", component: () => TaskNew() },
    { path: "/tasks/:id", component: (state) => TaskEdit({ id: state.params.id }) },
    { path: "/404", component: () => NotFound() },
  ],
  mode: "history",
  fallback: "/404",
});

function App() {
  return html`<${Router} router=${router} />`;
}

render(html`<${App} />`, document.getElementById("app")!);

