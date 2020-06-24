import * as My from "jm-ez-mysql";
import * as _ from "lodash";
import { Tables } from "../../../config/tables";
import { ResponseBuilder } from "../../../helpers/responseBuilder";
import { Utils } from "../../../helpers/utils";
import { MediaUpload } from "../../../helpers/mediaUpload";
import { FilterModel } from "./categoryModel";

export class CategoryUtil {

    // Add new category
    public async addCategory(data: any) {
        const category = {
            name: data.name,
            createdBy: data._user.id,
        }
        const newCategory = await My.insert(Tables.CATEGORY, category);
        return ResponseBuilder.data({ id: newCategory.insertId });
    }

    // Get all categories which are created by you or anyone else with content and images too
    public async getCategoryListWithContent(skip: number, limit: number, filterOptions: FilterModel): Promise<ResponseBuilder> {
        const joinQuery = `${Tables.CATEGORY} c LEFT JOIN ${Tables.CONTENT} cont ON cont.categoryId = c.id
        LEFT JOIN ${Tables.CONTENT_ATTACHMENT} ca ON ca.categoryId = c.id`;

        // process.env.IMAGE_PATH contains AWS HOST of S3 stored image link i.e aws-host/bucket-name/folder
        // ca.attachment contains uuid/original.ext
        const selectFields = ["c.name", "cont.text",
            `GROUP_CONCAT(DISTINCT CONCAT(IF(ca.categoryId IS NULL, "", CONCAT('${process.env.IMAGE_PATH}', '/', ca.attachment)))) AS attachments`];

        let whereQuery = "1=1";
        const params = [];

        if (filterOptions) {
            if (filterOptions.searchString) {
                const likeQuery = `LIKE '%${My.escape(filterOptions.searchString)}%'`;
                whereQuery += ` AND (c.name ${likeQuery} OR cont.text ${likeQuery})`;
            }
            if (filterOptions.categoryIds) {
                whereQuery += ` AND c.id IN (?)`;
                params.push(filterOptions.categoryIds);
            }
        }

        const limitQuery = `LIMIT ${skip}, ${limit}`;
        const groupQuery = " GROUP BY c.id";
        const categories = await My.findAll(joinQuery, selectFields, `${whereQuery} ${groupQuery} ${limitQuery}`, params);
        let count = 0;

        if (categories.length > 0) {
            const totalRows = await My.first(Tables.CATEGORY, ["COUNT(DISTINCT(id)) as count"], whereQuery, params);
            count = totalRows.count;
            categories.map((c: any) => {
                c.attachments = Utils.formatStringToArray(c, "attachments");
                return c;
            });
        }

        /*
        In sequlize, syntax will be like this
        categoryModal.findAll({
                subQuery: false,
                attributes: [
                    'name',
                    'id'
                ],
                include: [
                {
                    model: contentModel,
                    required: false,
                    attributes: ['text', 'id'],
                }, {
                    model: contentAttachmentModel,
                    required: false,
                    attributes: ['attachment', 'categoryId']
                }]
            });
        */
        return ResponseBuilder.data({ data: categories, totalRows: count });
    }

    // Get all category names for adding content in category
    public async getCategoryNames(userId: number): Promise<ResponseBuilder> {
        const categories = await My.findAll(Tables.CATEGORY, ["name", "id"], "createdBy = ?", [userId]);

        /*
        In sequelize, syntax will be like this
        categoryModal.findAll({
                subQuery: false,
                attributes: [
                    "name",
                    "id"
                ],
                where: { createdBy: userId }
            });
        */
        return ResponseBuilder.data(categories);
    }

    // Get all category names for filter categories drop-down
    public async getCategoryNamesForFilter(): Promise<ResponseBuilder> {
        const categories = await My.findAll(Tables.CATEGORY, ["name", "id"]);

        /*
        In sequelize, syntax will be like this
        categoryModal.findAll({
                subQuery: false,
                attributes: [
                    "name",
                    "id"
                ]
            });
        */
        return ResponseBuilder.data(categories);
    }

    // Get category details that created by user
    public async getCategoryDetails(userId: number, categoryId: number) {
        return await My.first(`${Tables.CATEGORY} c LEFT JOIN ${Tables.CONTENT} cn ON cn.categoryId = ?`,
            ["c.id", "c.createdBy", "cn.text", "cn.categoryId"],
            "c.createdBy = ? AND c.id = ?", [categoryId, userId, categoryId]);
        /*
            In sequelize, syntax will be like this
            categoryModal.findOne({
                        where: { createdBy: userId, id: categoryId },
                        attributes: ["id", "createdBy"],
                        include: [{
                            model: contentModel,
                            where: { categoryId: sequelize.col("category.id") },
                            required: false,
                            attributes: ["text", "categoryId"],
                        }]
                });
      */
    }

    // Add content (text only) in selected category
    public async addContent(details: any, categoryId: number) {
        // If cond checking that content is already added for this category
        if (details._category.text && details._category.categoryId) {
            await My.updateFirst(Tables.CONTENT, { text: details.text }, "categoryId = ?", [categoryId]);
            /*
            In sequelize,
                contentModal.update({ text: details.text }, {
                    where: { categoryId }, // variable name same thats why no need to assign value
                });
             */
        } else {
            await My.insert(Tables.CONTENT, { text: details.text, categoryId });
            /*
            In sequelize,
                contentModal.create({ text: details.text, categoryId });
             */
        }
        return;
    }

    // Add content (media only) in selected category
    public async addContentMedia(file: any, categoryId: number) {
        let result = {};
        let code = 400;
        try {
            const details = await MediaUpload.uploadFile(file) as any;
            const url = details.key ? details.key.split(process.env.AWS_BUCKET_PATH)[1] : "";
            if (url) {
                await My.insert(Tables.CONTENT_ATTACHMENT, { attachment: url, categoryId });
                result = { message: "FILE_UPLOAD_SUCCESS" };
                code = 200;
            } else {
                result = { error: "FILE_UPLOAD_FAILURE" };
            }
        } catch (e) {
            result = { error: "FILE_UPLOAD_FAILURE" };
        }
        return { code, result };
    }
}