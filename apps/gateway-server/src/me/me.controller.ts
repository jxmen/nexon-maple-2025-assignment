import { Controller, Get, Query, Req } from '@nestjs/common';
import { RequireRoles } from '../utils/decorators/require-roles';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { RewardService } from '../reward/reward.service';
import { RewardRequestLogStatus } from '../reward/enum/reward-request-log-status';
import { GetMeRewardRequestsResponse } from './dto/get-me-reward-requests.response';
import { AuthenticatedRequest } from '../utils/authenticated-request';

export class GetRewardRequestsQueryDto {
  @IsOptional()
  @IsString()
  event_code?: string;

  @IsOptional()
  @IsEnum(RewardRequestLogStatus)
  status?: RewardRequestLogStatus;
}

@Controller('me')
export class MeController {
  constructor(private readonly rewardService: RewardService) {}

  /**
   * 보상 요청 내역 조회 (유저 전용)
   */
  @Get('reward-requests')
  @RequireRoles('user')
  async meRewardRequests(
    @Req() req: AuthenticatedRequest,
    @Query() query: GetRewardRequestsQueryDto,
  ) {
    const userId = req.user.id;

    const response: GetMeRewardRequestsResponse =
      await this.rewardService.findAllMeRequests(userId, query);

    return {
      result: 'success',
      data: response.requests,
    };
  }
}
