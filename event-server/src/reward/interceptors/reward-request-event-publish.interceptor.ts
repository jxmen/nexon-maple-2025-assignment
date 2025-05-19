import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { RewardRequestEventPublisher } from '../reward-request-event.publisher.interface';
import { RewardRequestFaildEvent } from '../event/reward-request-faild.event';
import { RewardRequestSuccessEvent } from '../event/reward-request-success.event';

@Injectable()
export class RewardRequestEventPublishInterceptor implements NestInterceptor {
  constructor(
    @Inject('RewardRequestEventPublisher')
    private readonly eventPublisher: RewardRequestEventPublisher,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const payload = context.switchToRpc().getData();
    const eventCode = payload.event_code;
    const userId = payload.user_id;

    return next.handle().pipe(
      tap(() => {
        // 성공 이벤트 발행
        this.eventPublisher.publish(
          new RewardRequestSuccessEvent({ eventCode, userId }),
        );
      }),
      catchError((err) => {
        // 실패 이벤트 발행
        this.eventPublisher.publish(
          new RewardRequestFaildEvent({ eventCode, userId }),
        );

        return throwError(() => err);
      }),
    );
  }
}
