import { Injectable, Logger } from '@nestjs/common';
import { CreateEventRequest } from './dto/create-event.request';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Event } from './event.schema';
import { GetEventsResponse } from './dto/get-events.response';
import { RpcException } from '@nestjs/microservices';
import { GetEventDetailResponse } from './dto/get-event-detail.response';
import { Reward } from './reward.schema';
import { CreateEventRewardRequest } from './dto/create-event-reward.request';

@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name);

  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
    @InjectModel(Reward.name) private readonly rewardModel: Model<Reward>,
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
    this.logger.debug(`이벤트 생성됨. code:'${code}'`);
  }

  async findAll() {
    const events: Event[] = await this.eventModel.find().exec();

    return events.map((it) => new GetEventsResponse(it));
  }

  async findByCode(code: string) {
    const event = await this.validateExistByCode(code);

    return new GetEventDetailResponse(event);
  }

  async createReward(request: CreateEventRewardRequest) {
    const { event_code } = request;
    const event = await this.validateExistByCode(event_code);
    await this.validateRewardNotExistByEventCode(event_code);

    const created = new this.rewardModel({
      event_code,
      event_name: event.name,
      items: request.items,
    });
    await created.save();
    this.logger.debug(`이벤트 '${event_code}' 보상 생성됨`);
  }

  private async validateRewardNotExistByEventCode(eventCode: string) {
    const reward = await this.rewardModel
      .findOne({ event_code: eventCode })
      .exec();

    if (reward) {
      this.logger.debug(
        `이벤트에 대한 보상이 이미 생성되었습니다. code: '${eventCode}'`,
      );
      throw new RpcException({
        code: 'ALREADY_REWARD_REGISTERED',
        message: '이미 이벤트에 대한 보상이 생성되었습니다.',
      });
    }
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
