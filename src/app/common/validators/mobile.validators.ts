import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
export class MobilePrefixValidator implements ValidatorConstraintInterface {
  validate(text: string, validationArguments: ValidationArguments) {
    return text.length > 1 && text.search(/^[+]\d{1,3}$/g) !== -1;
  }
}

@ValidatorConstraint()
export class MobileValidator implements ValidatorConstraintInterface {
  validate(mobile: any, validationArguments: ValidationArguments) {
    return (
      mobile.digit.search(/^\d*$/g) !== -1 && mobile.prefix.search(/^[+]\d{1,3}$/g) !== -1
    );
  }
}
