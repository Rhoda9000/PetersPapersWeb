import { Task } from './Task';

export interface TaskStatus {
  id: number;
  name: string;
  isDeleted: boolean;
  task: Task;
}
