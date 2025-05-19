import { Injectable, Logger } from '@nestjs/common';
import { CreateEventRequest } from './dto/create-event.request';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Event } from './event.schema';
import { GetEventsResponse } from './dto/get-events.response';
import { RpcException } from '@nestjs/microservices';
import { GetEventDetailResponse } from './dto/get-event-detail.response';
import { Reward } from '../reward/reward.schema';
import { CreateEventRewardRequest } from './dto/create-event-reward.request';
import { EventValidator } from './event.validator';
import { RewardRequestLog } from '../reward/reward-request-log.schema';
import { EventEntity } from './event.entity';
import { RewardRequestResponse } from './dto/reward-request.response';

@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name);

  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
    @InjectModel(Reward.name) private readonly rewardModel: Model<Reward>,
    @InjectModel(RewardRequestLog.name)
    private readonly rewardRequestLogModel: Model<RewardRequestLog>,
    private readonly eventValidator: EventValidator,
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

  async createRewards(request: CreateEventRewardRequest) {
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

  async requestReward(eventCode: string, userId: string) {
    try {
      // TODO: (redis) 키값으로 조회하고, 없다면 저장하기 (reward-request:event_code:user_id)

      // 보상 요청 내역에서 지급하지 않았는지 확인 (캐시가 없거나, redis 장애 시 이 로직 수행)
      const successLog = await this.rewardRequestLogModel.findOne({
        event_code: eventCode,
        user_id: userId,
        status: 'success',
      });
      if (successLog) {
        throw new RpcException({
          code: 'REWARD_ALREADY_CLAIMED',
          message: '보상이 이미 지급되었습니다.',
        });
      }

      const eventRaw = await this.validateExistByCode(eventCode);
      const event = new EventEntity(eventRaw);

      if (event.isEnded()) {
        throw new RpcException({
          code: 'EVENT_ENDED',
          message: '종료된 이벤트입니다.',
        });
      }
      if (!event.isStarted()) {
        throw new RpcException({
          code: 'EVENT_NOT_STARTED',
          message: '이벤트가 아직 시작되지 않았습니다.',
        });
      }
      if (!event.isActivate()) {
        throw new RpcException({
          code: 'EVENT_NOT_ACTIVATED',
          message: '이벤트가 아직 활성화되지 않았습니다.',
        });
      }

      const reward = await this.validateRewardExistByEventCode(eventCode);
      await this.eventValidator.validateUserConditionSatisfied(event, userId);

      // 성공 내역 쌓기 - TODO: 비동기로 전환
      const newSuccessLog = new this.rewardRequestLogModel({
        event_code: eventCode,
        user_id: userId,
        status: 'success',
      });
      await newSuccessLog.save();

      return new RewardRequestResponse(reward.items);
    } catch (e) {
      // 실패 내역 쌓기 - TODO: 비동기로 전환
      const failedLog = new this.rewardRequestLogModel({
        event_code: eventCode,
        user_id: userId,
        status: 'failed',
      });
      await failedLog.save();

      // TODO: 캐시 키 삭제?

      throw e;
    }

    // TODO: 어떤 보상을 지급하는지 정보 리턴
    return undefined;
  }

  private async validateRewardExistByEventCode(eventCode: string) {
    const reward = await this.rewardModel
      .findOne({ event_code: eventCode })
      .exec();

    if (!reward) {
      this.logger.debug(
        `이벤트에 대한 보상이 설정되지 않았습니다. code: ${eventCode}`,
      );
      throw new RpcException({
        code: 'EVENT_REWARD_NOT_CONFIGURED',
        message: '이벤트에 대한 보상이 생성되지 않았습니다.',
      });
    }

    return reward;
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
