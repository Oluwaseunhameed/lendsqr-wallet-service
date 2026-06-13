export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface CreateUserInput {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  passwordHash: string;
}

export interface UserRow {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}
