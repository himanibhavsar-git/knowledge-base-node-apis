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
    req.body.signupType = Constants.SIGNUP_TYPES.EMAIL;

    // creating user profile in db
    const result: ResponseBuilder = await this.userUtil.createUser(req.body);

    if (result && result.result && result.result.id) {
      // JWT token
      const { name } = req.body;
      const userDetails = {
        token: Jwt.getAuthToken({ userId: result.result.id }),
        name,
      };

      res.status(result.code).json(userDetails); // sending only JWT token in response
    } else {
      res.status(result.code).json(result.result); // sending error if any
    }
  }

  // Sign-in api via email
  public signin = async (req: Request, res: Response) => {
    const { signupType, email, name } = req.body._authentication;
    const userDetails = {
      token: Jwt.getAuthToken({ userId: req.body._authentication.id }),
      signupType,
      email,
      name,
    };
    res.status(200).json(userDetails);
  }

  // Google sign-in
  public socialSignin = async (req: Request, res: Response) => {
    const { email, name, providerId } = req.body._authentication;
    const signupType = Constants.SIGNUP_TYPES.SOCIAL;
    if (req.body._newUser) {
      const user = {
        name,
        providerId,
        signupType,
        email,
      };
      const result: ResponseBuilder = await this.userUtil.createUser(user);
      req.body._authentication.id = result.result.id;
    }
    const userDetails = {
      token: Jwt.getAuthToken({ userId: req.body._authentication.id }),
      signupType,
      email,
      name,
    };
    res.status(200).json(userDetails);
  }
}