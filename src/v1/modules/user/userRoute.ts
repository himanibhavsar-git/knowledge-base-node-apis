// Import only what we need from express
import { Router } from "express";
import { Middleware } from "../../../middleware";

// Assign router to the express.Router() instance
const router: Router = Router();
const middleware = new Middleware();

// authorization routes

// Export the express.Router() instance to be used by server.ts
export const UserRoute: Router = router;
