import { Controller, Get, Res } from '@nestjs/common';
import { RewardService } from './reward.service';
import { Response } from 'express';
import { GetRewardsResponse } from './types/get-rewards.response';

@Controller('rewards')
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @Get()
  async getRewards(@Res() res: Response) {
    const response: GetRewardsResponse = await this.rewardService.findAll();

    return res.status(200).send({
      status: 200,
      result: 'success',
      data: response.rewards,
    });
  }
}
