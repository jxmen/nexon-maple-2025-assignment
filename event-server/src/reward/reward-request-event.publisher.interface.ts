import { RewardRequestFaildEvent } from './event/reward-request-faild.event';
import { RewardRequestSuccessEvent } from './event/reward-request-success.event';

export interface RewardRequestEventPublisher {
  publish(event: RewardRequestSuccessEvent | RewardRequestFaildEvent): void;
}
