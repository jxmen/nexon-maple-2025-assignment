// is-start-before-end.validator.ts
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsString,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EventType } from '../enums/event-type';

function IsStartBeforeEnd(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isStartBeforeEnd',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          if (!value || !relatedValue) return true;

          return value < relatedValue;
        },
      },
    });
  };
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
  @IsStartBeforeEnd('end_date', {
    message: '이벤트 시작 시간은 종료 시간 전이여야 합니다.',
  })
  start_date: Date;

  @Type(() => Date)
  @IsDate()
  end_date: Date;
}
