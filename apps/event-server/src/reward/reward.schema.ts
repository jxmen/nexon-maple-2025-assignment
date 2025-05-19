import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, SchemaTypes } from 'mongoose';

@Schema({ timestamps: true, collection: 'reward' })
export class Reward {
  @Prop({ required: true, unique: true })
  event_code: string;

  @Prop({ required: true })
  event_name: string;

  @Prop({ required: true, type: SchemaTypes.Map, of: Number })
  items: Map<string, number>;

  // --- Dates
  @Prop({ default: now() })
  createdAt: Date;

  @Prop({ default: now() })
  updatedAt: Date;
}

export const RewardSchema = SchemaFactory.createForClass(Reward);
