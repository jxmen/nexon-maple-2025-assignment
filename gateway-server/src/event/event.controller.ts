import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { RequireRoles } from '../utils/decorators/require-roles';
import { EventService } from './event.service';
import { CreateEventRequest } from './dto/create-event-request';

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
}
