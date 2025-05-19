import { Injectable, Logger } from '@nestjs/common';
import { CreateEventRequest } from './dto/create-event.request';
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

  /**
   * 이벤트를 생성합니다.
   */
  async create(req: CreateEventRequest) {
    const { code, name, type, condition, start_date, end_date } = req;

    await this.validateNotExistByCode(code);

    const createdEvent = new this.eventModel({
      code,
      name,
      type,
      condition,
      start_date,
      end_date,
    });
    await createdEvent.save();
    this.logger.debug(`이벤트 생성됨. code:'${code}'`);
  }

  private async validateNotExistByCode(code: string) {
    const event = await this.eventModel.findOne({ code });
    if (event) {
      throw new RpcException({
        code: 'EVENT_CODE_EXIST',
        message: '이미 존재하는 이벤트 코드이므로 저장할 수 없습니다.',
      });
    }
  }

  async findAll() {
    const events: Event[] = await this.eventModel.find().exec();

    return events.map((it) => new GetEventsResponse(it));
  }

  async findByCode(code: string) {
    const event = await this.validateExistByCode(code);

    return new GetEventDetailResponse(event);
  }

  /**
   * 이벤트가 존재하는지 검증하고, 찾은 이벤트를 리턴합니다. 이벤트가 없을 경우 예외를 던집니다.
   *
   * @param code 이벤트 코드
   * @private
   */
  private async validateExistByCode(code: string) {
    const event: Event = await this.eventModel.findOne({ code }).exec();
    if (!event) {
      this.logger.debug(`이벤트를 찾을 수 없음. code: '${code}'`);
      throw new RpcException({
        code: 'EVENT_NOT_FOUND',
        message: '해당 이벤트를 찾을 수 없습니다.',
      });
    }

    return event;
  }
}
