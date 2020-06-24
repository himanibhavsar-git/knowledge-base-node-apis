import { Request, Response } from "express";
import { CategoryUtil } from "./categoryUtil";

export class CategoryMiddleware {

    private categoryUtil: CategoryUtil = new CategoryUtil();

    // check category added by logged in user then and then he/she can add content.
    public checkCategoryCreatedByLoggedInUser = async (req: Request, res: Response, next: () => void) => {
        const category = await this.categoryUtil.getCategoryDetails(req.body._user.id, +req.params.categoryId);
        if (category) {
            req.body._category = category;
            next();
        } else {
            res.status(401).json({ error: "CATEGORY_NOT_CREATED_BY_YOU" });
        }
    }
}
