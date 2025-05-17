import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { CreateEventRequest } from './dto/create-event-request';

@Injectable()
export class EventsService {
  constructor(
    @Inject('EVENT_SERVER')
    private readonly eventServerClient: ClientProxy,
  ) {}

  async create(req: CreateEventRequest) {
    const pattern = 'create-event';

    return firstValueFrom(
      this.eventServerClient
        .send<{ result: 'success' | 'failed' }>(pattern, req)
        .pipe(
          catchError((err) => {
            switch (err?.code) {
              case 'INVALID_INPUT':
                return throwError(() => new BadRequestException(err.message));
              case 'ALREADY_EXIST_USER_CANNOT_SIGNUP':
                return throwError(() => new BadRequestException(err.message));
              default:
                return throwError(
                  () =>
                    new InternalServerErrorException(
                      err.message ?? 'Unexpected error',
                    ),
                );
            }
          }),
        ),
    );
  }
}
