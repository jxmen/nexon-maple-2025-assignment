import { User } from './user/user.schema';

export interface TokenGenerator {
  generate(user: User): { accessToken: string; accessTokenExpiredAt: Date };
}
