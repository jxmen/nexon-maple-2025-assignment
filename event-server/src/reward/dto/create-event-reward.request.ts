import {
  IsNotEmpty,
  IsObject,
  IsString,
  registerDecorator,
  Validate,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

function HasAtLeastOneKey(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'hasAtLeastOneKey',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return (
            typeof value === 'object' &&
            value !== null &&
            Object.keys(value).length > 0
          );
        },
      },
    });
  };
}

@ValidatorConstraint({ name: 'isAllValuesNumber', async: false })
class IsAllValuesNumber implements ValidatorConstraintInterface {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(value: Record<string, any>, _args: ValidationArguments): boolean {
    if (typeof value !== 'object' || value === null) return false;

    return Object.values(value).every(
      (v) => typeof v === 'number' && !isNaN(v),
    );
  }
}

export class CreateEventRewardRequest {
  @IsNotEmpty()
  @IsString()
  event_code: string;

  @HasAtLeastOneKey({ message: '보상은 반드시 1개 이상이 있어야 합니다.' })
  @IsObject()
  @Validate(IsAllValuesNumber, {
    message: '모든 보상은 숫자 형태로 수량이 주어져야 합니다',
  })
  items: Record<string, number>;
}
