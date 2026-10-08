import { html, createState } from "@_bashell/slash/core";
import { TaskFormData, TaskStatus } from "../types/task";
import styles from "../styles/tasks.module.css";

type TaskFormProps = {
  mode: "create" | "edit";
  initialData?: TaskFormData;
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
};

export function TaskForm({ mode, initialData, onSubmit, onCancel }: TaskFormProps) {
  // Desabilitar tracking automático para este componente
  // pois gerenciamos a reatividade manualmente via watch
  (globalThis as any).__SLASH_TRACK_STATE__ = undefined;

  const formState = createState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    status: initialData?.status || TaskStatus.Pending,
    errors: {
      title: "",
      description: "",
    },
  });

  function validate(): boolean {
    const state = formState.get();
    const errors = {
      title: "",
      description: "",
    };

    const title = state.title.trim();
    const description = state.description.trim();

    if (!title) {
      errors.title = "Título é obrigatório";
    } else if (title.length < 3) {
      errors.title = "Título deve ter no mínimo 3 caracteres";
    }

    if (!description) {
      errors.description = "Descrição é obrigatória";
    } else if (description.length < 10) {
      errors.description = "Descrição deve ter no mínimo 10 caracteres";
    }

    formState.set({ ...state, errors });

    return !errors.title && !errors.description;
  }

  function handleSubmit(e: Event) {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const state = formState.get();
    const data: TaskFormData = {
      title: state.title.trim(),
      description: state.description.trim(),
      status: state.status,
    };

    onSubmit(data);
  }

  // Criando elementos reativos para exibir erros
  const titleErrorElement = html`<span class=${styles.error}></span>` as HTMLElement;
  const descriptionErrorElement = html`<span class=${styles.error}></span>` as HTMLElement;

  // Função para atualizar erros
  const updateErrors = (state: { title: string; description: string; status: TaskStatus; errors: { title: string; description: string } }) => {
    titleErrorElement.textContent = state.errors.title;
    descriptionErrorElement.textContent = state.errors.description;
  };

  // Watch para atualizar erros quando o estado mudar
  formState.watch(updateErrors);

  // Handler para input do título
  const handleTitleInput = (e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    const prev = formState.get();
    formState.set({ ...prev, title: value, errors: { ...prev.errors, title: "" } });
  };

  // Handler para input da descrição
  const handleDescriptionInput = (e: Event) => {
    const value = (e.target as HTMLTextAreaElement).value;
    const prev = formState.get();
    formState.set({ ...prev, description: value, errors: { ...prev.errors, description: "" } });
  };

  // Handler para mudança de status
  const handleStatusChange = (e: Event) => {
    const value = (e.target as HTMLSelectElement).value as TaskStatus;
    const prev = formState.get();
    formState.set({ ...prev, status: value });
  };

  const initialState = formState.get();

  return html`
    <form class=${styles.form} onSubmit=${handleSubmit}>
      <div class=${styles.formGroup}>
        <label for="title">Título</label>
        <input
          type="text"
          id="title"
          class=${styles.input}
          value=${initialState.title}
          onInput=${handleTitleInput}
          placeholder="Digite o título da tarefa"
        />
        ${titleErrorElement}
      </div>

      <div class=${styles.formGroup}>
        <label for="description">Descrição</label>
        <textarea
          id="description"
          class=${styles.textarea}
          value=${initialState.description}
          onInput=${handleDescriptionInput}
          placeholder="Digite a descrição da tarefa"
          rows="5"
        ></textarea>
        ${descriptionErrorElement}
      </div>

      <div class=${styles.formGroup}>
        <label for="status">Status</label>
        <select
          id="status"
          class=${styles.select}
          value=${initialState.status}
          onChange=${handleStatusChange}
        >
          <option value=${TaskStatus.Pending}>Pendente</option>
          <option value=${TaskStatus.InProgress}>Em Progresso</option>
          <option value=${TaskStatus.Completed}>Concluída</option>
        </select>
      </div>

      <div class=${styles.formActions}>
        <button type="submit" class=${styles.btnPrimary}>
          ${mode === "create" ? "Criar Tarefa" : "Salvar Alterações"}
        </button>
        <button type="button" class=${styles.btnSecondary} onClick=${onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  `;
}
