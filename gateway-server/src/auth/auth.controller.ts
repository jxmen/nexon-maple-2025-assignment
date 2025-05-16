import { Controller } from '@nestjs/common';
import { UserCreateRequest } from './dto/user.create-request';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async signUp(dto: UserCreateRequest) {
    throw new Error('NotImplemented');
  }
}
