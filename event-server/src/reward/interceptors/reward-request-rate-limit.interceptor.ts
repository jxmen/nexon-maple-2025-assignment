import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { RedisService } from '../../redis/redis.service';
import { RewardRequestEventPublisher } from '../reward-request-event.publisher.interface';
import { RewardRequestFaildEvent } from '../event/reward-request-faild.event';

@Injectable()
export class RewardRequestRateLimitInterceptor implements NestInterceptor {
  constructor(
    private readonly redisService: RedisService,
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

    // 최초 요청은 eventCode:userId 형태로 키 값을 저장합니다. 한번에 여러번 요청이 들어오면 예외를 던집니다.
    const key = `reward-request-rate-limit:${eventCode}:${userId}`;
    const allowed = await this.redisService.set(key, '1');
    if (!allowed) {
      this.eventPublisher.publish(
        new RewardRequestFaildEvent({ eventCode, userId }),
      );
      throw new RpcException({
        code: 'TOO_MANY_REQUESTS',
        message: '요청이 너무 빠릅니다. 잠시 후 다시 시도해주세요.',
      });
    }

    return next.handle().pipe(
      tap(async () => {
        await this.redisService.del(key);
      }),
    );
  }
}
