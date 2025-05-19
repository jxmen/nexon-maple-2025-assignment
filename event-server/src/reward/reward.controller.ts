import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RewardService } from './reward.service';
import { GetRewardsResponse } from './dto/get-rewards.response';
import { CreateEventRewardRequest } from '../event/dto/create-event-reward.request';

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
}
