import * as bcryptjs from "bcryptjs";
import { Request, Response } from "express";
import * as _ from "lodash";
import { Constants } from "../../../config/constants";
import { ResponseBuilder } from "../../../helpers/responseBuilder";
import { UserUtil } from "./userUtil";
import { Jwt } from "../../../helpers/jwt";

export class UserController {
  private userUtil: UserUtil = new UserUtil();

  // Sign up api
  public signup = async (req: any, res: Response) => {

    // encrypt password and then store
    req.body.password = bcryptjs.hashSync(req.body.password, Constants.PASSWORD_HASH);

    // creating user profile in db
    const result: ResponseBuilder = await this.userUtil.createUser(req.body);

    if (result && result.result && result.result.id) {
      // JWT token
      const { firstName, lastName, name } = req.body;
      const userDetails = {
        token: Jwt.getAuthToken({ userId: result.result.id }),
        name,
        firstName,
        lastName,
      };

      res.status(result.code).json(userDetails); // sending only JWT token in response
    } else {
      res.status(result.code).json(result.result); // sending error if any
    }
  }

  // Sign-in api via email
  public signin = async (req: Request, res: Response) => {
    const { signupType, email, firstName, lastName } = req.body._authentication;
    const userDetails = {
      token: Jwt.getAuthToken({ userId: req.body._authentication.id }),
      signupType,
      email,
      firstName,
      lastName
    };
    res.status(200).json(userDetails);
  }

  // Google sign-in
  public socialSignin = async (req: Request, res: Response) => {
    const { signupType, email, firstName, lastName } = req.body._authentication;
    const userDetails = {
      token: Jwt.getAuthToken({ userId: req.body._authentication.id }),
      signupType,
      email,
      firstName,
      lastName
    };
    res.status(200).json(userDetails);
  }
}