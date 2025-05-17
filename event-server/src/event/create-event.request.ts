import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsValidDateRange } from '../utils/decorators/validate-date-range.decorator';

export enum EventType {
  CHECK_IN = 'check-in',
}

class EventDateDto {
  @IsDateString()
  start: string;

  @IsDateString()
  end: string;
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

  @ValidateNested()
  @Type(() => EventDateDto)
  @IsValidDateRange({ message: '시작일은 종료일보다 빨라야 합니다.' })
  date: EventDateDto;
}
