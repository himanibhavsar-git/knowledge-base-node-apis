import { Response } from "express";

export class Middleware {
  public getUserAuthorized = async (req: any, res: Response, next: () => void) => {
    // todo authorization code here
  }
}
