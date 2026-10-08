import { html } from "@_bashell/slash/core";
import { TaskForm } from "../components/TaskForm";
import { addTask } from "../store/tasks";
import { TaskFormData } from "../types/task";
import styles from "../styles/tasks.module.css";

export function TaskNew() {
  function handleSubmit(data: TaskFormData) {
    console.log("[TaskNew] handleSubmit recebido:", data);
    const task = addTask(data);
    console.log("[TaskNew] Task adicionada:", task);
    console.log("[TaskNew] Navegando para /tasks");
    window.location.href = "/tasks";
    console.log("[TaskNew] Navegação concluída");
  }

  function handleCancel() {
    console.log("[TaskNew] handleCancel chamado");
    window.location.href = "/tasks";
  }

  return html`
    <div class=${styles.container}>
      <div class=${styles.header}>
        <h1>Nova Tarefa</h1>
        <div class=${styles.nav}>
          <a href="/" class=${styles.navLink}>Dashboard</a>
          <a href="/tasks" class=${styles.navLink}>Tarefas</a>
        </div>
      </div>

      <${TaskForm} mode="create" onSubmit=${handleSubmit} onCancel=${handleCancel} />
    </div>
  `;
}
