import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateEventRequest } from './dto/create-event.request';
import { EventService } from './event.service';
import { CreateEventRewardRequest } from './dto/create-event-reward.request';
import { RewardRequestRequest } from './dto/reward-request.request';
import { RewardRequestResponse } from './dto/reward-request.response';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @MessagePattern('create-event')
  async createEvent(@Payload() req: CreateEventRequest) {
    await this.eventService.create(req);

    return {
      result: 'success',
    };
  }

  @MessagePattern('get-events')
  async getEvents() {
    const events = await this.eventService.findAll();

    return { events };
  }

  @MessagePattern('get-event-detail')
  async getEventDetail(@Payload() payload: { code: string }) {
    const { code } = payload;

    return await this.eventService.findByCode(code);
  }

  @MessagePattern('create-event-rewards')
  async createEventRewards(@Payload() request: CreateEventRewardRequest) {
    await this.eventService.createRewards(request);

    return {
      result: 'success',
    };
  }

  @MessagePattern('reward-request')
  async rewardRequest(@Payload() request: RewardRequestRequest) {
    const { event_code, user_id } = request;

    const response: RewardRequestResponse =
      await this.eventService.requestReward(event_code, user_id);

    return {
      result: 'success',
      items: response.items,
    };
  }
}
