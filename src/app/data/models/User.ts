import { Department } from './Department';
import { Task } from './Task';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  cellNumber: string;
  dateCreated: Date;
  isDeleted: boolean;
  departmentId: number;
  department: Department;
  tasks: Task[];
}
