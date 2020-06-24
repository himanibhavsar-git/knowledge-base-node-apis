// Import only what we need from express
import { Router } from "express";
import { Validator } from "../../../validate";
import { CategoryController } from "./categoryController";
import { NewCategoryModel, AddContentModel, AddContentMediaModel, FilterModel } from "./categoryModel";
import { CategoryMiddleware } from "./categoryMiddleware";
import * as multipart from "connect-multiparty";

// Assign router to the express.Router() instance
const router: Router = Router();
const v: Validator = new Validator();
const categoryController = new CategoryController();
const categoryMiddleware = new CategoryMiddleware();
const multipartMiddleware = multipart();

// category routes
router.post("/new", v.validate(NewCategoryModel), categoryController.addCategory);
router.post("/list-with-content", v.validate(FilterModel), categoryController.getCategoriesWithContent); // for all users
router.get("/list", categoryController.getCategoryNames);
router.get("/list-for-filter", categoryController.getCategoryNamesForFilter);

// content routes
router.post("/:categoryId/content/add", v.validate(AddContentModel), categoryMiddleware.checkCategoryCreatedByLoggedInUser,
    categoryController.addContent);

// can add single file per request
router.post("/:categoryId/content/media/add", multipartMiddleware, v.fileValidate(AddContentMediaModel),
    categoryMiddleware.checkCategoryCreatedByLoggedInUser,
    categoryController.addContentMedia);

// Export the express.Router() instance to be used by server.ts
export const CategoryRoute: Router = router;
