import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_SERVER') private readonly authServerClient: ClientProxy,
  ) {}

  async signUp(id: string, password: string) {
    return firstValueFrom(
      this.authServerClient
        .send<{ result: string }>('sign-up', { id, password })
        .pipe(
          catchError((err) => {
            if (err?.code == 'ALREADY_EXIST_USER_CANNOT_SIGNUP') {
              return throwError(() => new BadRequestException(err.message));
            }

            return throwError(
              () =>
                new InternalServerErrorException(
                  err.message ?? '예상치 못한 에러가 발생했습니다.',
                ),
            );
          }),
        ),
    );
  }

  async signIn(id: string, password: string) {
    return firstValueFrom(
      this.authServerClient
        .send<UserLoginSuccessResponse>('sign-in', { id, password })
        .pipe(
          catchError((err) => {
            if (err?.code === 'LOGIN_FAILED') {
              return throwError(() => new UnauthorizedException(err.message));
            }

            return throwError(
              () =>
                new InternalServerErrorException(
                  err.message ?? '예상치 못한 에러가 발생했습니다.',
                ),
            );
          }),
        ),
    );
  }
}
