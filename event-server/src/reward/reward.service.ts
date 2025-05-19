import { Inject, Injectable, Logger } from '@nestjs/common';
import { GetRewardsResponse } from './dto/get-rewards.response';
import { Reward } from './reward.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateEventRewardRequest } from './dto/create-event-reward.request';
import { Event } from '../event/event.schema';
import { RpcException } from '@nestjs/microservices';
import { EventEntity } from '../event/event.entity';
import { RewardRequestSuccessEvent } from 'src/reward/event/reward-request-success.event';
import { RewardRequestFaildEvent } from 'src/reward/event/reward-request-faild.event';
import { RewardRequestLog } from './reward-request-log.schema';
import { EventValidator } from '../event/event.validator';
import { RewardRequestEventPublisher } from './reward-request-event.publisher.interface';
import { RewardRequestResponse } from '../event/dto/reward-request.response';

@Injectable()
export class RewardService {
  constructor(
    // === database models
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
    @InjectModel(Reward.name) private readonly rewardModel: Model<Reward>,
    @InjectModel(RewardRequestLog.name)
    private readonly rewardRequestLogModel: Model<RewardRequestLog>,
    // === others ...
    private readonly eventValidator: EventValidator,
    @Inject('RewardRequestEventPublisher')
    private readonly eventPublisher: RewardRequestEventPublisher,
  ) {}

  private readonly logger = new Logger(RewardService.name);

  /**
   * 보상 목록을 리턴합니다.
   */
  async findAll(): Promise<GetRewardsResponse[]> {
    const rewards: Reward[] = await this.rewardModel.find({}).exec();

    return rewards.map((it) => new GetRewardsResponse(it));
  }

  /**
   * 보상을 생성합니다.
   */
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

  /**
   * 보상을 요청합니다.
   *
   * @param eventCode 이벤트 식별자
   * @param userId 유저 식별자
   */
  async requestReward(eventCode: string, userId: string) {
    try {
      // TODO: (redis) 키값으로 조회하고, 없다면 저장하기 (reward-request:event_code:user_id)

      // 보상 요청 내역에서 지급하지 않았는지 확인 (캐시가 없거나, redis 장애 시 이 로직 수행)
      await this.validateSuccessLogIsNotExist({ eventCode, userId });

      // 이벤트가 있는지 조회하고, 엔티티로 만든다. (엔티티 메서드를 통해 내부 비즈니스 로직을 검증한다.)
      const eventRaw = await this.validateExistByCode(eventCode);
      const event = new EventEntity(eventRaw);

      // 이벤트 검증 - 보상을 줄 수 있는 상태인지, 조건을 충족하는지 등
      await this.eventValidator.validateRewardClaimableStatus(event);
      const reward = await this.validateRewardExistByEventCode(eventCode);
      await this.eventValidator.validateUserConditionSatisfied(event, userId);

      // 성공 이벤트 발행
      this.eventPublisher.publish(
        new RewardRequestSuccessEvent({ eventCode, userId }),
      );

      // 보상 정보 응답
      return new RewardRequestResponse(reward.items);
    } catch (e) {
      // 실패 이벤트 발행
      this.eventPublisher.publish(
        new RewardRequestFaildEvent({ eventCode, userId }),
      );

      // TODO: 캐시 키 삭제?

      throw e;
    }
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

  private async validateSuccessLogIsNotExist(param: {
    eventCode: string;
    userId: string;
  }) {
    const { eventCode, userId } = param;

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
  }
}
