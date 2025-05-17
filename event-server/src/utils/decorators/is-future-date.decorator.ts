import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsFutureDate(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isFutureDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          if (!value) return false;

          const inputDate = new Date(value);
          const now = new Date();

          return inputDate.getTime() > now.getTime();
        },
        defaultMessage(_args: ValidationArguments) {
          return `${propertyName} must be a future date`;
        },
      },
    });
  };
}