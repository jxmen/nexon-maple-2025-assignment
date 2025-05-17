import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum EventType {
  CHECK_IN = 'check-in',
}

export class CreateEventRequest {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsEnum(EventType)
  type: EventType;

  @IsObject()
  condition: Record<string, any>;

  @Type(() => Date)
  @IsDate()
  start_date: Date;

  @Type(() => Date)
  @IsDate()
  end_date: Date;
}
