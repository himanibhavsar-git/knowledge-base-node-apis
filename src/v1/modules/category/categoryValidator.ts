import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import * as My from "jm-ez-mysql";
import { Tables } from "../../../config/tables";
import { Constants } from "../../../config/constants";

@ValidatorConstraint({ async: true })
export class CategoryAlreadyExistConstraint implements ValidatorConstraintInterface {
    public async validate(name: string, args: ValidationArguments) {
        const category = await My.first(Tables.CATEGORY, ["id"], "name = ?", [name]);
        if (category) {
            return false;
        } else {
            return true;
        }
    }
}

@ValidatorConstraint({ async: false })
export class IsMediaSizeValidConstraint implements ValidatorConstraintInterface {
    public validate(file: any, args: ValidationArguments) {
        return file.size < Constants.UPLOAD_SIZES.IMAGE;
    }
}

@ValidatorConstraint({ async: false })
export class IsMediaTypeValidConstraint implements ValidatorConstraintInterface {
    public validate(file: any, args: ValidationArguments) {
        return Constants.IMAGE_MIMES.includes(file.type);
    }
}