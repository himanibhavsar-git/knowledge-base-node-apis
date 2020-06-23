import express = require("express");
import { Middleware } from "./middleware";
import { UserRoute } from "./v1/modules/user/userRoute";

export class Routes {
  protected basePath: string;
  constructor() {
    this.basePath = "/app/dist";
  }
  public defaultRoute(req: express.Request, res: express.Response) {
    res.json({
      message: "Hello !",
    });
  }

  public path() {
    const router = express.Router();
    const middleware = new Middleware();
    router.use("/user", UserRoute);

    router.all("/*", (req, res) => {
      return res.status(404).json({
        error: "ERR_URL_NOT_FOUND",
      });
    });
    return router;
  }
}
