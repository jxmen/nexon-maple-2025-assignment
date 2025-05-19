import { Controller, Get, Query } from '@nestjs/common';
import { RewardService } from '../reward/reward.service';
import { RequireRoles } from '../utils/decorators/require-roles';
import { GetRewardRequestsQueryDto } from '../me/me.controller';
import { GetRewardRequestsResponse } from './dto/get-reward-requests.response';

@Controller('reward-requests')
export class RewardRequestsController {
  constructor(private readonly rewardService: RewardService) {}

  @Get()
  @RequireRoles('admin', 'operator', 'auditor')
  async getRewardRequests(@Query() query: GetRewardRequestsQueryDto) {
    const response: GetRewardRequestsResponse =
      await this.rewardService.findAllRequests(query);

    return {
      result: 'success',
      data: response.requests,
    };
  }
}
