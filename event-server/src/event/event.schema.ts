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
}

export const EventSchema = SchemaFactory.createForClass(Event);
