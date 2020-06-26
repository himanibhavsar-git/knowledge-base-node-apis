import {
  IsEmail, IsNotEmpty, IsOptional, Validate, MaxLength
} from "class-validator";
import {
  IsPasswordMatchesRequirementsConstraint,
} from "./userValidator";
import { Model } from "../../../model";

export class UserModel extends Model {



  @IsNotEmpty()
  @MaxLength(50, { message: "MAX_LENGTH_VALIDATION_FOR_50_CHAR" })
  public name: string;

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
      name,
      email,
      password,
    } = body;
    this.email = email;
    this.name = name;
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
  public providerId: string;

  @IsOptional()
  public name: string;

  constructor(body: any) {
    super();
    const {
      email,
      providerId,
      name,
    } = body;

    this.email = email;
    this.providerId = providerId;
    this.name = name;
  }
}