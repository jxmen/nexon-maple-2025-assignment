import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { RequireRoles } from '../utils/decorators/require-roles';
import { EventService } from './event.service';
import { CreateEventRequest } from './dto/create-event-request';
import { GetEventsResponse } from './types/get-events.response';
import { GetEventDetailResponse } from './types/get-event-detail.response';
import { CreateEventRewardRequest } from './types/create-event-reward.request';
import { AuthenticatedRequest } from '../utils/authenticated-request';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @RequireRoles('admin', 'operator')
  @Post()
  async createEvent(@Body() req: CreateEventRequest, @Res() res: Response) {
    await this.eventService.create(req);

    res.status(201).send({
      status: 201,
      result: 'success',
    });
  }

  @Get()
  async getEvents(@Res() res: Response) {
    const response: GetEventsResponse = await this.eventService.findAll();

    res.status(200).send({
      status: 200,
      result: 'success',
      data: response.events,
    });
  }

  @Get(':code')
  async getEventDetail(@Param('code') code: string, @Res() res: Response) {
    const response: GetEventDetailResponse =
      await this.eventService.findByCode(code);

    res.status(200).send({
      status: 200,
      result: 'success',
      data: response,
    });
  }

  @Post(':event_code/rewards')
  @RequireRoles('admin', 'operator')
  async createEventRewards(
    @Param('event_code') eventCode: string,
    @Body() request: CreateEventRewardRequest,
    @Res() res: Response,
  ) {
    await this.eventService.createEventRewards(eventCode, request);

    res.status(201).send({
      status: 201,
      result: 'success',
    });
  }

  @Post(':event_code/reward-request')
  @RequireRoles('user')
  async rewardRequest(
    @Param('event_code') eventCode: string,
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
  ) {
    const userId = req.user.id;

    const reward = await this.eventService.rewardRequest(eventCode, userId);

    res.status(200).send({
      status: 200,
      result: 'success',
      message: '보상이 성공적으로 지급되었습니다.',
      data: {
        items: reward.items,
      },
    });
  }
}
