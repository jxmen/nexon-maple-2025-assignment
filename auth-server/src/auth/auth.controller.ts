import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import UserCreateRequest from '../user/user.create-request';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() req: UserCreateRequest, @Res() res: Response) {
    await this.authService.signUp(req.id, req.password);

    res.status(HttpStatus.CREATED).send({});
  }
}
