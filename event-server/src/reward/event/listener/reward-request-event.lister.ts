import { OnEvent } from '@nestjs/event-emitter';
import { RewardRequestSuccessEvent } from '../reward-request-success.event';
import { Injectable, Logger } from '@nestjs/common';
import { RewardRequestFaildEvent } from '../reward-request-faild.event';
import { RewardRequestLog } from '../../reward-request-log.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RedisService } from '../../../redis/redis.service';

@Injectable()
export class RewardRequestEventLister {
  constructor(
    @InjectModel(RewardRequestLog.name)
    private readonly logModel: Model<RewardRequestLog>,
    private readonly redisService: RedisService,
  ) {}

  private readonly logger = new Logger(RewardRequestEventLister.name);

  @OnEvent('reward-request.success')
  async handleSuccess(payload: RewardRequestSuccessEvent) {
    const { eventCode, userId } = payload;

    const successLog = new this.logModel({
      event_code: eventCode,
      user_id: userId,
      status: 'success',
    });
    await successLog.save();
    this.logger.debug(
      `이벤트 보상 요청 성공! - eventCode: '${eventCode}', userId: '${userId}`,
    );

    await this.redisService.del(
      `reward-request-rate-limit:${eventCode}:${userId}`,
    );
  }

  @OnEvent('reward-request.failed')
  async handleFailed(payload: RewardRequestFaildEvent) {
    const { eventCode, userId } = payload;

    const failedLog = new this.logModel({
      event_code: eventCode,
      user_id: userId,
      status: 'failed',
    });
    await failedLog.save();

    this.logger.debug(
      `이벤트 보상 요청 실패. eventCode: '${eventCode}', userId: '${userId}`,
    );
  }
}
