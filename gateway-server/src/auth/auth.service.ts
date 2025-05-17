import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_SERVER') private readonly authServerClient: ClientProxy,
  ) {}

  async signUp(id: string, password: string) {
    try {
      await firstValueFrom(
        this.authServerClient
          .send<{ result: string }>('sign-up', { id, password })
          .pipe(
            catchError((err) => {
              if (err?.code == 'ALREADY_EXIST_USER_CANNOT_SIGNUP') {
                throw new BadRequestException(err.message);
              } else {
                throw err;
              }
            }),
          ),
      );
    } catch (e) {
      throw e;
    }
  }

  async signIn(id: string, password: string) {
    try {
      return await firstValueFrom(
        this.authServerClient
          .send<UserLoginSuccessResponse>('sign-in', { id, password })
          .pipe(
            catchError((err) => {
              if (err?.code == 'LOGIN_FAILED') {
                throw new UnauthorizedException(err.message);
              } else {
                throw err;
              }
            }),
          ),
      );
    } catch (e) {
      throw e;
    }
  }
}
