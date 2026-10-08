export enum TaskStatus {
  Pending = "pending",
  InProgress = "in_progress",
  Completed = "completed",
}

export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type TaskFormData = {
  title: string;
  description: string;
  status: TaskStatus;
};

export type TaskSummary = {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
};
