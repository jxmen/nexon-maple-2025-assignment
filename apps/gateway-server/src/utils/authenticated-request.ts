import { JwtUser } from '../auth/types/jwt-user.type';

export interface AuthenticatedRequest extends Request {
  user: JwtUser;
}
