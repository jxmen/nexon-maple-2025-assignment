export type UserRole = 'user' | 'operator' | 'auditor' | 'admin';

export type JwtUser = {
  id: string;
  role: UserRole;
};
