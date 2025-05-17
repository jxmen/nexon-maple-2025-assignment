import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { RequireRoles } from '../utils/decorators/require-roles';
import { EventsService } from './events.service';
import { CreateEventRequest } from './dto/create-event-request';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @RequireRoles('admin', 'operator')
  @Post()
  async createEvent(@Body() req: CreateEventRequest, @Res() res: Response) {
    await this.eventsService.create(req);

    res.status(201).send({
      status: 201,
      result: 'success',
    });
  }
}
