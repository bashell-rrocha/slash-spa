// Importar apenas o necessário usando subpaths otimizados
import { html, render } from "@_bashell/slash/core";
import { createRouter, Router } from "@_bashell/slash/router";
import { Dashboard } from "./pages/Dashboard";
import { Tasks } from "./pages/Tasks";
import { TaskEdit } from "./pages/TaskEdit";
import { TaskNew } from "./pages/TaskNew";
import { NotFound } from "./pages/NotFound";

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

const root = document.getElementById("app");
if (!root) throw new Error("Elemento #app não encontrado");
render(html`<${App} />`, root);

