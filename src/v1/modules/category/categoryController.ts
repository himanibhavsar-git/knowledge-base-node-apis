import { Request, Response } from "express";
import * as _ from "lodash";
import { ResponseBuilder } from "../../../helpers/responseBuilder";
import { CategoryUtil } from "./categoryUtil";
import { Utils } from "../../../helpers/utils";

export class CategoryController {
    private categoryUtil: CategoryUtil = new CategoryUtil();

    // Add new category
    public addCategory = async (req: Request, res: Response) => {

        // insert category in db
        const result: ResponseBuilder = await this.categoryUtil.addCategory(req.body);
        if (result && result.result.insertId) {
            res.status(result.code).json({ message: "CATEGORY_ADDED" });
        } else {
            res.status(result.code).json(result.result);
        }
    }

    // Get all categories created by you or anyone else
    public getCategoriesWithContent = async (req: Request, res: Response) => {
        const { skip, limit } = Utils.getSkipLimit(+req.query.page);
        const categories: ResponseBuilder = await this.categoryUtil.getCategoryListWithContent(skip, limit, req.body);
        res.status(categories.code).json(categories.result);
    }

    // Get all categories names for adding content
    public getCategoryNames = async (req: Request, res: Response) => {
        const categories: ResponseBuilder = await this.categoryUtil.getCategoryNames(req.body._user.id);
        res.status(categories.code).json(categories.result);
    }

    // Get all categories names for drop - down filter
    public getCategoryNamesForFilter = async (req: Request, res: Response) => {
        const categories: ResponseBuilder = await this.categoryUtil.getCategoryNamesForFilter();
        res.status(categories.code).json(categories.result);
    }

    // Add content text
    public addContent = async (req: Request, res: Response) => {
        await this.categoryUtil.addContent(req.body, +req.params.categoryId);
        res.status(200).json({ message: "CONTENT_ADDED" });
    }

    // Add content media
    public addContentMedia = async (req: Request, res: Response) => {
        const { code, result } = await this.categoryUtil.addContentMedia(req.files.image, +req.params.categoryId);
        res.status(code).json(result);
    }
}