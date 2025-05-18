import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RewardService } from './reward.service';
import { GetRewardsResponse } from './dto/get-rewards.response';

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
}
