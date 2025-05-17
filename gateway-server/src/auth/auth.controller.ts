import { Body, Controller, Post, Res } from '@nestjs/common';
import { UserCreateRequest } from './dto/user.create-request';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { UserLoginRequest } from './dto/user.login-request';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() req: UserCreateRequest, @Res() res: Response) {
    await this.authService.signUp(req.id, req.password);

    res.status(201).send();
  }

  /**
   * 로그인
   */
  @Post('sign-in')
  async signIn(@Body() req: UserLoginRequest, @Res() res: Response) {
    const response: UserLoginSuccessResponse = await this.authService.signIn(
      req.id,
      req.password,
    );

    res.status(200).send({
      status: 200,
      data: {
        accessToken: response.accessToken,
        accessTokenExpired: response.accessTokenExpired,
      },
      error: null,
    });
  }
}
