import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsValidDateRange(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isValidDateRange',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(_: any, args: ValidationArguments) {
          const { start, end } = args.object[args.property];
          if (!start || !end) return false;

          return new Date(start) < new Date(end);
        },
        defaultMessage(args: ValidationArguments) {
          return `"${args.property}.start" must be earlier than "${args.property}.end"`;
        },
      },
    });
  };
}
