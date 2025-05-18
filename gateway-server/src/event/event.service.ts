import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { CreateEventRequest } from './types/create-event-request';
import { GetEventsResponse } from './types/get-events.response';
import { GetEventDetailResponse } from './types/get-event-detail.response';

@Injectable()
export class EventService {
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

  async findAll() {
    const pattern = 'get-events';

    return firstValueFrom(
      this.eventServerClient
        .send<GetEventsResponse>(pattern, {})
        .pipe(catchError((err) => throwError(() => err))),
    );
  }

  async findByCode(code: string) {
    const pattern = 'get-event-detail';

    return firstValueFrom(
      this.eventServerClient
        .send<GetEventDetailResponse>(pattern, { code })
        .pipe(
          catchError((err) => {
            if (err?.code == 'EVENT_NOT_FOUND') {
              return throwError(() => new NotFoundException(err.message));
            }

            return throwError(
              () =>
                new InternalServerErrorException(
                  err.message ?? 'Unexpected error',
                ),
            );
          }),
        ),
    );
  }
}
