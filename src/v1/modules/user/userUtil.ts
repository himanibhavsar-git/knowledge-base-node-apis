import * as My from "jm-ez-mysql";
import * as _ from "lodash";
import { Tables } from "../../../config/tables";
import { ResponseBuilder } from "../../../helpers/responseBuilder";
import { UserModel, SocialAuthModel } from "./userModel";
import { Constants } from "../../../config/constants";

export class UserUtil {
  // Create User
  public async createUser(userDetail: UserModel): Promise<ResponseBuilder> {
    const newUser = await My.insert(Tables.USER, userDetail);
    return ResponseBuilder.data({ id: newUser.insertId });
  }

  // check user email is exists or not
  public async getDetailByEmail(email: string) {
    return await My.first(Tables.USER, ["id", "firstName", "lastName", "email", "password", "signupType"],
      "email = ? AND signupType = ?", [email, Constants.SIGNUP_TYPES.EMAIL]);
  }

  // check user email is exists or not
  public async getSocialUser(data: SocialAuthModel) {
    return await My.first(Tables.USER, ["id", "firstName", "lastName", "email", "signupType"],
      "email = ? AND signupType = ? AND providerId = ?", [data.email, data.signupType, data.providerId]);
  }
}