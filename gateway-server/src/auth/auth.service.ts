import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(@Inject('AUTH_SERVER') private readonly client: ClientProxy) {}

  async signUp(id: string, password: string) {
    try {
      await firstValueFrom(
        this.client.send<{ result: string }>('sign-up', { id, password }).pipe(
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
}
