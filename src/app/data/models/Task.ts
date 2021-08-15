import { TaskStatus } from './TaskStatus';
import { User } from './User';

export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: Date;
  dateCreated: Date;
  isDeleted: boolean;
  userId: number;
  user: User;
  taskStatusId: number;
  taskStatus: TaskStatus;
}
