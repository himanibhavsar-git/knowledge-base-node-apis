import {
  IsEmail, IsEnum, IsNotEmpty, IsPositive, IsOptional, Validate, MaxLength, IsBoolean, IsNumber
} from "class-validator";
import {
  IsPasswordMatchesRequirementsConstraint,
} from "./userValidator";
import { Constants } from "../../../config/constants";
import { Model } from "../../../model";

export class UserModel extends Model {

  @IsNotEmpty()
  @MaxLength(40, { message: "MAX_LENGTH_VALIDATION_FOR_40_CHAR" })
  public firstName: string;

  @IsNotEmpty()
  @MaxLength(40, { message: "MAX_LENGTH_VALIDATION_FOR_40_CHAR" })
  public lastName: string;

  @IsEmail({}, { message: "EMAIL_INVALID" })
  @IsNotEmpty()
  public email: string;

  @IsNotEmpty()
  @Validate(IsPasswordMatchesRequirementsConstraint, {
    message: "PASSWORD_WARNING",
  })
  public password: string;

  constructor(body: any) {
    super();
    const {
      firstName,
      lastName,
      email,
      password,
    } = body;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.password = password;
  }
}

export class AuthModel extends Model {
  @IsNotEmpty()
  @IsEmail({}, { message: "EMAIL_INVALID" })
  public email: string;

  @IsNotEmpty()
  public password: string;

  constructor(body: any) {
    super();
    const {
      email,
      password,
    } = body;

    this.email = email;
    this.password = password;
  }
}

export class SocialAuthModel extends Model {
  @IsNotEmpty()
  @IsEmail({}, { message: "EMAIL_INVALID" })
  public email: string;

  @IsNotEmpty()
  @IsEnum([Constants.SIGNUP_TYPES.SOCIAL])
  public signupType: string;

  @IsNotEmpty()
  public providerId: string;

  constructor(body: any) {
    super();
    const {
      email,
      signupType,
      providerId,
    } = body;

    this.email = email;
    this.signupType = signupType;
    this.providerId = providerId;
  }
}