import { User } from './User';

export interface Department {
  id: number;
  name: string;
  isDeleted: boolean;
  user: User;
}
