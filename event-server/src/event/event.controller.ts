import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateEventRequest } from './dto/create-event.request';
import { EventService } from './event.service';

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
}
