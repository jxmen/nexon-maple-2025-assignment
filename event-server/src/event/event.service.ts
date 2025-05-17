import { Injectable, Logger } from '@nestjs/common';
import { CreateEventRequest } from './create-event.request';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Event } from './event.schema';

@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name);

  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
  ) {}

  async create(req: CreateEventRequest) {
    const { code, name, type, condition, start_date, end_date } = req;

    const createdEvent = new this.eventModel({
      code,
      name,
      type,
      condition,
      start_date,
      end_date,
    });
    await createdEvent.save();
    this.logger.debug(`이벤트 code '${code}' 생성됨`);
  }
}
