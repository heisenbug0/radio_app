export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  MANAGER = "manager",
}

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  password?: string;

  createdAt: string;
  updatedAt: string;
  __v: number;
}
