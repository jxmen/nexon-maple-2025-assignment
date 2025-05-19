import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now } from 'mongoose';

export enum RewardRequestLogStatus {
  Success = 'success',
  Failed = 'failed',
}

@Schema({ timestamps: true, collection: 'reward_request_log' })
export class RewardRequestLog {
  @Prop({ required: true })
  event_code: string;

  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true, enum: RewardRequestLogStatus })
  status: RewardRequestLogStatus;

  // --- Dates
  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export const RewardRequestLogSchema =
  SchemaFactory.createForClass(RewardRequestLog);
