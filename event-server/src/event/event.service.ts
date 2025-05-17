import { Injectable, Logger } from '@nestjs/common';
import { CreateEventRequest } from './create-event.request';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Event } from './event.schema';
import { GetEventsResponse } from './dto/get-events.response';
import { RpcException } from '@nestjs/microservices';
import { GetEventDetailResponse } from './dto/get-event-detail.response';

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

  async findAll() {
    const events: Event[] = await this.eventModel.find().exec();

    return events.map((it) => new GetEventsResponse(it));
  }

  async findByCode(code: string) {
    const event: Event = await this.eventModel.findOne({ code }).exec();
    if (!event) {
      this.logger.debug(`이벤트를 찾을 수 없음. code: '${code}'`);
      throw new RpcException({
        code: 'EVENT_NOT_FOUND',
        message: '해당 이벤트를 찾을 수 없습니다.',
      });
    }

    return new GetEventDetailResponse(event);
  }
}
