import { html } from "@_bashell/slash/core";
import { TaskForm } from "../components/TaskForm";
import { getTaskById, updateTask } from "../store/tasks";
import { TaskFormData } from "../types/task";
import styles from "../styles/tasks.module.css";

export function TaskEdit({ id }: { id: string }) {
  const task = getTaskById(id);

  if (!task) {
    return html`
      <div class=${styles.container}>
        <div class=${styles.notFound}>
          <h1>404</h1>
          <h2>Tarefa não encontrada</h2>
          <p>A tarefa que você está procurando não existe.</p>
          <a href="/tasks" class=${styles.btnPrimary}>Voltar para Tarefas</a>
        </div>
      </div>
    `;
  }

  function handleSubmit(data: TaskFormData) {
    updateTask(id, data);
    window.location.href = "/tasks";
  }

  function handleCancel() {
    window.location.href = "/tasks";
  }

  return html`
    <div class=${styles.container}>
      <div class=${styles.header}>
        <h1>Editar Tarefa</h1>
        <div class=${styles.nav}>
          <a href="/" class=${styles.navLink}>Dashboard</a>
          <a href="/tasks" class=${styles.navLink}>Tarefas</a>
        </div>
      </div>

      <${TaskForm}
        mode="edit"
        initialData=${{
          title: task.title,
          description: task.description,
          status: task.status,
        }}
        onSubmit=${handleSubmit}
        onCancel=${handleCancel}
      />
    </div>
  `;
}
