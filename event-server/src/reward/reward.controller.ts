import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RewardService } from './reward.service';
import { GetRewardsResponse } from './dto/get-rewards.response';
import { CreateEventRewardRequest } from './dto/create-event-reward.request';
import { RewardRequestRequest } from '../event/dto/reward-request.request';
import { RewardRequestResponse } from '../event/dto/reward-request.response';

@Controller('reward')
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @MessagePattern('get-rewards')
  async getRewards() {
    const rewards: GetRewardsResponse[] = await this.rewardService.findAll();

    return {
      result: 'success',
      rewards,
    };
  }

  @MessagePattern('create-event-rewards')
  async createEventRewards(@Payload() request: CreateEventRewardRequest) {
    await this.rewardService.createRewards(request);

    return {
      result: 'success',
    };
  }

  @MessagePattern('reward-request')
  async rewardRequest(@Payload() request: RewardRequestRequest) {
    const { event_code, user_id } = request;

    const response: RewardRequestResponse =
      await this.rewardService.requestReward(event_code, user_id);

    return {
      result: 'success',
      items: response.items,
    };
  }
}
