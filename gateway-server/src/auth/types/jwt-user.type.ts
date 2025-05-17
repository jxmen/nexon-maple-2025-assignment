export type JwtUser = {
  id: number;
  role: 'user' | 'operator' | 'auditor' | 'admin';
};
