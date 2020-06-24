import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({ async: false })
export class IsPasswordMatchesRequirementsConstraint implements ValidatorConstraintInterface {
  public validate(password: string, args: ValidationArguments) {
    /* ==*password validator regex*==
     should have one uppercase,
     one lowercase,
     min length should be 6,
     max length should be 30
     no white space allowed*/
    const regex = new RegExp("^(?!.* )(?=.*?[A-Z])(?=.*?[a-z]).{6,30}$");
    return regex.test(password);
  }
}
