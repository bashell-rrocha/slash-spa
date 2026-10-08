import { html } from "@_bashell/slash/core";
import { totalTasks, pendingTasks, inProgressTasks, completedTasks, taskStore } from "../store/tasks";
import { TaskStatus } from "../types/task";
import styles from "../styles/tasks.module.css";

function getStatusLabel(status: TaskStatus): string {
  switch (status) {
    case TaskStatus.Pending:
      return "Pendente";
    case TaskStatus.InProgress:
      return "Em Progresso";
    case TaskStatus.Completed:
      return "Concluída";
    default:
      return status;
  }
}

function getStatusClass(status: TaskStatus): string {
  switch (status) {
    case TaskStatus.Pending:
      return styles.statusPending;
    case TaskStatus.InProgress:
      return styles.statusInProgress;
    case TaskStatus.Completed:
      return styles.statusCompleted;
    default:
      return "";
  }
}

export function Dashboard() {
  // Usar .get() para ter dados estáticos no componente
  // Com a API atual de slash, componentes não re-renderizam automaticamente
  const allTasks = taskStore.get().tasks;

  const recentTasks = [...allTasks]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 5);

  return html`
    <div class=${styles.container}>
      <div class=${styles.header}>
        <h1>Dashboard - Gerenciador de Tarefas</h1>
      </div>

      <div class=${styles.summary}>
        <div class=${styles.summaryCard}>
          <h3>Total</h3>
          <div class="count">${totalTasks}</div>
        </div>
        <div class=${styles.summaryCard}>
          <h3>Pendentes</h3>
          <div class="count">${pendingTasks}</div>
        </div>
        <div class=${styles.summaryCard}>
          <h3>Em Progresso</h3>
          <div class="count">${inProgressTasks}</div>
        </div>
        <div class=${styles.summaryCard}>
          <h3>Concluídas</h3>
          <div class="count">${completedTasks}</div>
        </div>
      </div>

      <div class=${styles.recentTasks}>
        <h2>Tarefas Recentes</h2>

        ${recentTasks.length === 0
          ? html`
              <div class=${styles.empty}>
                <h3>Nenhuma tarefa cadastrada</h3>
                <p>Comece criando sua primeira tarefa!</p>
                <a href="/tasks/new" class=${styles.btnPrimary}>Criar Tarefa</a>
              </div>
            `
          : html`
              <ul class=${styles.taskList}>
                ${recentTasks.map((task) => html`
                  <li class=${styles.taskItem} key=${task.id}>
                    <div class=${styles.taskInfo}>
                      <h3 class=${styles.taskTitle}>${task.title}</h3>
                      <p class=${styles.taskDescription}>${task.description}</p>
                      <div class=${styles.taskMeta}>
                        <span class="${styles.status} ${getStatusClass(task.status)}">
                          ${getStatusLabel(task.status)}
                        </span>
                        <span> • Atualizada em ${task.updatedAt.toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div class=${styles.taskActions}>
                      <a href=${`/tasks/${task.id}`} class=${styles.btnEdit}>Editar</a>
                    </div>
                  </li>
                `)}
              </ul>
              <div style="margin-top: 20px;">
                <a href="/tasks" class=${styles.btnPrimary}>Ver Todas as Tarefas</a>
                <a href="/tasks/new" class=${styles.btnSecondary} style="margin-left: 10px;">
                  Criar Nova Tarefa
                </a>
              </div>
            `}
      </div>
    </div>
  `;
}
