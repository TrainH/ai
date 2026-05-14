export interface User {
  id: Long;
  email: string;
  name: string;
  phone?: string;
  role: 'ROLE_USER' | 'ROLE_ADMIN';
  status: 'ACTIVE' | 'SUSPENDED' | 'DELETED';
  marketingAgreed: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuthResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: User;
}

export type Long = number;
