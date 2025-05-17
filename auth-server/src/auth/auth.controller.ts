import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import UserCreateRequest from '../user/user.create-request';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('sign-up')
  async signUp(@Payload() req: UserCreateRequest) {
    await this.authService.signUp(req.id, req.password);

    return {
      result: 'success',
    };
  }
}
