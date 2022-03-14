import { ValidationArguments, ValidationOptions } from 'class-validator';

export const errMessage = (args: ValidationArguments) => {
  return `${args.property} missing`;
};

export const defaultValidationOptions: ValidationOptions = {
  message: errMessage,
};
