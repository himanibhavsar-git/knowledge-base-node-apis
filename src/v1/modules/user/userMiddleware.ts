import bcryptjs = require("bcryptjs");
import { Request, Response } from "express";
import { UserUtil } from "./userUtil";

export class UserMiddleware {

    private userUtil: UserUtil = new UserUtil();

    public checkEmailExists = async (req: Request, res: Response, next: () => void) => {
        const user = await this.userUtil.getDetailByEmail(req.body.email);
        if (user) {
            res.status(400).json({ error: "ERR_EMAIL_ALREADY_EXISTS" });
        } else {
            next();
        }
    }

    public checkCredentials = async (req: any, res: Response, next: () => void) => {

        // get user detail by email address
        const user = await this.userUtil.getDetailByEmail(req.body.email);

        // check credentials matches or not
        if (user && user.id &&
            await bcryptjs.compare(req.body.password, user.password)) {
            req.body._authentication = user;
            next();
        } else {
            res.status(401).json({ error: "INVALID_CREDENTIALS" });
        }
    }

    public checkSocialCredentials = async (req: any, res: Response, next: () => void) => {

        // get user detail google provider id
        const user = await this.userUtil.getSocialUser(req.body);
        req.body._newUser = false;

        if (user && user.id) {
            req.body._authentication = user;
        } else {
            req.body._authentication = req.body;
            req.body._newUser = true;
        }
    }
}
