import { RewardRequestEventPublisher } from '../../reward-request-event.publisher.interface';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RewardRequestFaildEvent } from '../reward-request-faild.event';
import { RewardRequestSuccessEvent } from '../reward-request-success.event';

/**
 * Nest에서 제공하는 eventEmitter로 구현한 publisher 구현체
 *
 * NOTE: 추후 kafka 등으로 교체 시, 새 클래스 만들어서 구현체로 변경하기
 */
@Injectable()
export class NestRewardRequestEventPublisher
  implements RewardRequestEventPublisher
{
  constructor(private readonly eventEmitter2: EventEmitter2) {}

  publish(event: RewardRequestSuccessEvent | RewardRequestFaildEvent): void {
    if (event instanceof RewardRequestSuccessEvent) {
      this.eventEmitter2.emit('reward-request.success', event);
    } else if (event instanceof RewardRequestFaildEvent) {
      this.eventEmitter2.emit('reward-request.failed', event);
    } else {
      throw new Error('정의되지 않은 보상 요청 이벤트입니다.');
    }
  }
}
