export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  department?: string;
  jobTitle?: string;
  timezone?: string;
  role: UserRole;
  active: boolean;
  emailVerified: boolean;
  lastLoginAt?: string;
  permissions: string[];
  tenantId: string;
  createdAt: string;
}

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  SALES_MANAGER = 'SALES_MANAGER',
  SALES_REPRESENTATIVE = 'SALES_REPRESENTATIVE',
  SUPPORT_AGENT = 'SUPPORT_AGENT',
  MARKETING_MANAGER = 'MARKETING_MANAGER',
  CUSTOMER = 'CUSTOMER'
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  company?: string;
}
