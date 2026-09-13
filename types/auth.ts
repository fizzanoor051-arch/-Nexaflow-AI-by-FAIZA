export type UserRole = "user" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Session {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  session?: Session;
  message?: string;
  error?: string;
}

export interface ProfileUpdateData {
  name: string;
  email: string;
}