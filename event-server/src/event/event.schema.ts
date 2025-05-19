import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now } from 'mongoose';
import { EventType } from './enum/event-type';

export type EventStatus = 'activate' | 'deactivate';

@Schema({ timestamps: true, collection: 'event' })
export class Event {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: EventType;

  @Prop({ type: Object })
  condition: Record<string, any> = {};

  @Prop({ required: true })
  start_date: Date;

  @Prop({ required: true })
  end_date: Date;

  @Prop({ required: true, default: 'activate' })
  status: EventStatus;

  @Prop({ default: now() })
  createdAt: Date;

  @Prop({ default: now() })
  updatedAt: Date;

  /**
   * 테스트 코드에서만 사용!
   */
  static _testCreate(init?: Partial<Event>): Event {
    return new Event(init);
  }

  public constructor(init?: Partial<Event>) {
    Object.assign(this, init);
  }

  isEnded(date: Date = new Date()) {
    return date > this.end_date;
  }
}

export const EventSchema = SchemaFactory.createForClass(Event);
