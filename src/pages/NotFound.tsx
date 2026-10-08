import { html } from "@_bashell/slash/core";
import styles from "../styles/tasks.module.css";

export function NotFound() {
  function goBack() {
    window.history.back();
  }

  return html`
    <div class=${styles.container}>
      <div class=${styles.notFound}>
        <h1>404</h1>
        <h2>Página não encontrada</h2>
        <p>A página que você está procurando não existe.</p>
        <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px;">
          <button onClick=${goBack} class=${styles.btnSecondary}>Voltar</button>
          <a href="/" class=${styles.btnPrimary}>Ir para Dashboard</a>
        </div>
      </div>
    </div>
  `;
}
