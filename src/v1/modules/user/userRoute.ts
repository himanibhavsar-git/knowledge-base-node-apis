// Import only what we need from express
import { Router } from "express";
import { Validator } from "../../../validate";
import { UserController } from "./userController";
import { UserMiddleware } from "./userMiddleware";
import { AuthModel, UserModel, SocialAuthModel } from "./userModel";

// Assign router to the express.Router() instance
const router: Router = Router();
const v: Validator = new Validator();
const userController = new UserController();
const userMiddleware = new UserMiddleware();

// authorization route
router.post("/sign-up", v.validate(UserModel), userMiddleware.checkEmailExists, userController.signup);
router.post("/sign-in", v.validate(AuthModel), userMiddleware.checkCredentials, userController.signin);
router.post("/social-sign-in", v.validate(SocialAuthModel), userMiddleware.checkSocialCredentials, userController.socialSignin);

// Export the express.Router() instance to be used by server.ts
export const UserRoute: Router = router;
