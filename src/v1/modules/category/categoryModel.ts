import {
    IsNotEmpty, MaxLength, Validate, IsOptional, IsPositive, ValidateNested
} from "class-validator";

import { Model } from "../../../model";
import { CategoryAlreadyExistConstraint, IsMediaSizeValidConstraint, IsMediaTypeValidConstraint } from "./categoryValidator";

export class NewCategoryModel extends Model {

    @IsNotEmpty()
    @MaxLength(100, { message: "MAX_LENGTH_VALIDATION_FOR_100_CHAR" })
    @Validate(CategoryAlreadyExistConstraint, {
        message: "CATEGORY_EXIST",
    })
    public name: string;

    constructor(body: any) {
        super();
        const {
            name,
        } = body;
        this.name = name;
    }
}

export class AddContentModel extends Model {

    @IsNotEmpty()
    public text: string;

    constructor(body: any) {
        super();
        const {
            text,
        } = body;
        this.text = text;
    }
}

export class AddContentMediaModel extends Model {

    @IsNotEmpty()
    @Validate(IsMediaSizeValidConstraint, {
        message: "IMAGE_SIZE_ERROR_SHOULD_BE_LESS_THAN_1_MB",
    })
    @Validate(IsMediaTypeValidConstraint, {
        message: "IMAGE_TYPE_INVALID",
    })
    public image: any;

    constructor(body: any) {
        super();
        const {
            image,
        } = body;
        this.image = image;
    }
}

export class FilterModel extends Model {

    @IsOptional()
    @ValidateNested()
    public categoryIds: number[]; // for selecting multiple categories

    @IsOptional()
    public searchString: string;

    constructor(body: any) {
        super();
        const {
            categoryIds,
            searchString
        } = body;
        this.categoryIds = categoryIds;
        this.searchString = searchString;
    }
}