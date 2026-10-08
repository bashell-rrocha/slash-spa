import { html, createState } from "@_bashell/slash/core";
import { taskStore, deleteTask } from "../store/tasks";
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

export function Tasks() {
  const filterState = createState({
    status: "all" as "all" | TaskStatus,
  });

  // Criar um Reactive para a propriedade status
  const statusReactive = {
    get: () => filterState.get().status,
    subscribe: (fn: (v: "all" | TaskStatus) => void) => {
      return filterState.watch((state) => fn(state.status));
    },
  };

  function handleDelete(id: string) {
    if (confirm("Tem certeza que deseja excluir esta tarefa?")) {
      deleteTask(id);
    }
  }

  // Cria um Reactive simples que combina taskStore.tasks + filterState.status
  const filteredTasks = {
    get: () => {
      const allTasks = taskStore.get().tasks;
      const status = filterState.get().status;
      return status === "all" ? allTasks : allTasks.filter((task) => task.status === status);
    },
    subscribe: (fn: (tasks: any[]) => void) => {
      const unsubTasks = taskStore.watch(() => fn(filteredTasks.get()));
      const unsubFilter = filterState.watch(() => fn(filteredTasks.get()));
      return () => {
        unsubTasks();
        unsubFilter();
      };
    },
  };

  // Reactive para renderizar a lista de tarefas
  const taskListContent = {
    get: () => {
      const tasks = filteredTasks.get();
      const status = filterState.get().status;

      if (tasks.length === 0) {
        return html`
          <div class=${styles.empty}>
            <h3>Nenhuma tarefa encontrada</h3>
            <p>${status === "all" ? "Comece criando sua primeira tarefa!" : "Nenhuma tarefa com este status."}</p>
            <a href="/tasks/new" class=${styles.btnPrimary}>Criar Tarefa</a>
          </div>
        `;
      }

      return html`
        <ul class=${styles.taskList}>
          ${tasks.map((task) => html`
            <li class=${styles.taskItem} key=${task.id}>
              <div class=${styles.taskInfo}>
                <h3 class=${styles.taskTitle}>${task.title}</h3>
                <p class=${styles.taskDescription}>${task.description}</p>
                <div class=${styles.taskMeta}>
                  <span class="${styles.status} ${getStatusClass(task.status)}">
                    ${getStatusLabel(task.status)}
                  </span>
                  <span> • Criada em ${task.createdAt.toLocaleDateString()}</span>
                  <span> • Atualizada em ${task.updatedAt.toLocaleDateString()}</span>
                </div>
              </div>
              <div class=${styles.taskActions}>
                <a href=${`/tasks/${task.id}`} class=${styles.btnEdit}>Editar</a>
                <button class=${styles.btnDanger} onClick=${() => handleDelete(task.id)}>Excluir</button>
              </div>
            </li>
          `)}
        </ul>
      `;
    },
    subscribe: (fn: (content: any) => void) => {
      const unsubTasks = taskStore.watch(() => fn(taskListContent.get()));
      const unsubFilter = filterState.watch(() => fn(taskListContent.get()));
      return () => {
        unsubTasks();
        unsubFilter();
      };
    },
  };

  return html`
    <div class=${styles.container}>
      <div class=${styles.header}>
        <h1>Tarefas</h1>
        <div class=${styles.nav}>
          <a href="/" class=${styles.navLink}>Dashboard</a>
          <a href="/tasks/new" class=${styles.btnPrimary}>Nova Tarefa</a>
        </div>
      </div>

      <div class=${styles.filter}>
        <label>Filtrar por status:</label>
        <select
          class=${styles.select}
          value=${statusReactive}
          onChange=${(e: Event) => {
            const value = (e.target as HTMLSelectElement).value;
            filterState.set({ status: value as "all" | TaskStatus });
          }}
        >
          <option value="all">Todas</option>
          <option value=${TaskStatus.Pending}>Pendentes</option>
          <option value=${TaskStatus.InProgress}>Em Progresso</option>
          <option value=${TaskStatus.Completed}>Concluídas</option>
        </select>
      </div>

      ${taskListContent}
    </div>
  `;
}
