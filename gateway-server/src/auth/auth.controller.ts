import { Body, Controller, Post, Res } from '@nestjs/common';
import { UserCreateRequest } from './dto/user.create-request';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() req: UserCreateRequest, @Res() res: Response) {
    await this.authService.signUp(req.id, req.password);

    res.status(201).send();
  }
}
