import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class StartDateAfterRegistrationDeadlineConstraint
  implements ValidatorConstraintInterface
{
  validate(value: unknown, args: ValidationArguments): boolean {
    const object = args.object as {
      registrationDeadline?: Date | string;
    };

    if (!(value instanceof Date)) {
      return false;
    }

    const registrationDeadline =
      object.registrationDeadline instanceof Date
        ? object.registrationDeadline
        : new Date(object.registrationDeadline ?? '');

    return (
      Boolean(registrationDeadline) &&
      value.getTime() > registrationDeadline.getTime()
    );
  }

  defaultMessage(): string {
    return 'startDate must be after registrationDeadline';
  }
}

export function StartDateAfterRegistrationDeadline(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator:
        StartDateAfterRegistrationDeadlineConstraint,
    });
  };
}
