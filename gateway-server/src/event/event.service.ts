import {
  BadRequestException,
  ConflictException,
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
import { CreateEventRewardRequest } from './types/create-event-reward.request';

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
                return this.handleUnexpectedError(err);
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
        .pipe(catchError((err) => this.handleUnexpectedError(err))),
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
              return this.handleEventNotFound(err);
            }

            return this.handleUnexpectedError(err);
          }),
        ),
    );
  }

  async createEventRewards(
    eventCode: string,
    request: CreateEventRewardRequest,
  ) {
    const pattern = 'create-event-rewards';

    return firstValueFrom(
      this.eventServerClient
        .send<{ result: 'success' }>(pattern, {
          event_code: eventCode,
          ...request,
        })
        .pipe(
          catchError((err) => {
            const errorHandlers: Record<string, () => any> = {
              INVALID_INPUT: () =>
                throwError(() => new BadRequestException(err.message)),
              EVENT_NOT_FOUND: () => this.handleEventNotFound(err),
              ALREADY_REWARD_REGISTERED: () =>
                throwError(() => new ConflictException(err.message)),
            };

            const handler = errorHandlers[err.code];

            return handler ? handler() : this.handleUnexpectedError(err);
          }),
        ),
    );
  }

  private handleEventNotFound(err) {
    return throwError(() => new NotFoundException(err.message));
  }

  private handleUnexpectedError(err) {
    return throwError(
      () => new InternalServerErrorException(err.message ?? 'Unexpected error'),
    );
  }
}
