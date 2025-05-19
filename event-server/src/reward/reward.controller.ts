import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RewardService } from './reward.service';
import { GetRewardsResponse } from './dto/get-rewards.response';
import { CreateEventRewardRequest } from './dto/create-event-reward.request';
import { RewardRequestRequest } from './dto/reward-request.request';
import { RewardRequestResponse } from './dto/reward-request.response';
import { GetMeRewardRequestsRequest } from './dto/get-me-reward-requests.request';
import { GetMeRewardRequestsResponse } from './dto/get-me-reward-requests.response';
import { GetRewardRequestsRequest } from './dto/get-reward-requests.request';
import { GetRewardRequestsResponse } from './dto/get-reward-requests.response';
import { RewardRequestRateLimitInterceptor } from './interceptors/reward-request-rate-limit.interceptor';
import { RewardRequestEventPublishInterceptor } from './interceptors/reward-request-event-publish.interceptor';

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

  @UseInterceptors(
    RewardRequestRateLimitInterceptor,
    RewardRequestEventPublishInterceptor,
  )
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

  @MessagePattern('get-me-reward-requests')
  async getMeRewardRequests(@Payload() request: GetMeRewardRequestsRequest) {
    const rewardRequests: GetMeRewardRequestsResponse =
      await this.rewardService.findAllMeRewardRequests(request);

    return {
      result: 'success',
      requests: rewardRequests,
    };
  }

  @MessagePattern('get-reward-requests')
  async getRewardRequests(@Payload() request: GetRewardRequestsRequest) {
    const requests: GetRewardRequestsResponse[] =
      await this.rewardService.findAllRewardRequests(request);

    return {
      results: 'success',
      requests,
    };
  }
}
