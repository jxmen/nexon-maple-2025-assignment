import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom, Observable, throwError } from 'rxjs';
import { CreateEventRequest } from './dto/create-event-request';
import { GetEventsResponse } from './dto/get-events.response';
import { GetEventDetailResponse } from './dto/get-event-detail.response';
import { CreateEventRewardRequest } from './dto/create-event-reward.request';
import { RequestRewardResponse } from './dto/request-reward.response';

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
              case 'EVENT_CODE_EXIST':
                return throwError(() => new ConflictException(err.message));
              default:
                return this.handleUnexpectedError(err);
            }
          }),
        ),
    );
  }

  async findAll(page: number, size: number) {
    const pattern = 'get-events';

    return firstValueFrom(
      this.eventServerClient
        .send<GetEventsResponse>(pattern, { page, size })
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

  async rewardRequest(
    eventCode: string,
    userId: string,
  ): Promise<RequestRewardResponse> {
    const pattern = 'reward-request';

    return firstValueFrom(
      this.eventServerClient
        .send<RequestRewardResponse>(pattern, {
          event_code: eventCode,
          user_id: userId,
        })
        .pipe(
          catchError((err) => {
            const errorHandlers: Record<string, () => Observable<never>> = {
              TOO_MANY_REQUESTS: () =>
                throwError(() => new HttpException(err.message, 429)),
              EVENT_NOT_FOUND: () => this.handleEventNotFound(err),
              EVENT_ENDED: () =>
                throwError(() => new BadRequestException(err.message)),
              EVENT_NOT_STARTED: () =>
                throwError(() => new BadRequestException(err.message)),
              EVENT_NOT_ACTIVATED: () =>
                throwError(() => new BadRequestException(err.message)),
              EVENT_REWARD_NOT_CONFIGURED: () =>
                throwError(() => new ConflictException(err.message)),
              EVENT_CONDITION_NOT_MET: () =>
                throwError(() => new ForbiddenException(err.message)),
              REWARD_ALREADY_CLAIMED: () =>
                throwError(() => new ConflictException(err.message)),
            };

            const handler = errorHandlers[err.code];

            return handler ? handler() : this.handleUnexpectedError(err);
          }),
        ),
    );
  }

  private handleEventNotFound(err): Observable<never> {
    return throwError(() => new NotFoundException(err.message));
  }

  private handleUnexpectedError(err): Observable<never> {
    return throwError(
      () => new InternalServerErrorException(err.message ?? 'Unexpected error'),
    );
  }
}
