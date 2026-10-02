export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginUserPayload {
  id: string;
  email: string;
  role: UserRole;
}

export interface LoginResponse {
  token: string;
  user: LoginUserPayload;
}

export interface ApiErrorBody {
  message: string;
}
