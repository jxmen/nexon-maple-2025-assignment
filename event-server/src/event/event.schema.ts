import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now } from 'mongoose';
import { EventType } from './create-event.request';

@Schema({ timestamps: true, collection: 'user' })
export class Event {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: EventType;

  @Prop({ type: Object })
  condition: Record<string, any> = {};

  @Prop({ required: true })
  date: {
    start: Date;
    end: Date;
  };

  // 추후 리워드 관련 컬럼 추가 필요

  @Prop({ default: now() })
  createdAt: Date;

  @Prop({ default: now() })
  updatedAt: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);
