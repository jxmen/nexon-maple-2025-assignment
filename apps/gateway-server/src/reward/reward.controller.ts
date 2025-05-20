import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
  Res,
} from '@nestjs/common';
import { RewardService } from './reward.service';
import { Response } from 'express';
import { GetRewardsResponse } from './dto/get-rewards.response';

@Controller('rewards')
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @Get()
  async getRewards(
    @Res() res: Response,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(20), ParseIntPipe) size: number,
  ) {
    const response: GetRewardsResponse = await this.rewardService.findAll(
      page,
      size,
    );

    return res.status(200).send({
      status: 200,
      result: 'success',
      data: response.rewards,
    });
  }
}
