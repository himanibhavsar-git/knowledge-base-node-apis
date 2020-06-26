import { Request, Response } from "express";
import { Jwt } from "./helpers/jwt";
import * as My from "jm-ez-mysql";
import { Tables } from "./config/tables";
import * as _ from "lodash";

export class Middleware {
  public getUserAuthorized = async (req: Request, res: Response, next: () => void) => {
    if (req.headers.authorization) {
      const tokenInfo = Jwt.decodeAuthToken(req.headers.authorization.toString());
      if (tokenInfo) {
        const user = await My.first(Tables.USER, ["id", "signupType", "email", "name"],
          "id = ?", [tokenInfo.userId]);

        if (user) {
          req.body._user = user;
          next();
        } else {
          res.status(401).json({ error: "ERR_UNAUTHORIZED" });
          return;
        }
      } else {
        res.status(401).json({ error: "ERR_UNAUTHORIZED" });
        return;
      }
    } else {
      // i.e originally error will be `req.t("ERR_UNAUTHORIZED")` so we can change messages in different language easily
      res.status(401).json({ error: "ERR_UNAUTHORIZED" });
      return;
    }
  }
}
