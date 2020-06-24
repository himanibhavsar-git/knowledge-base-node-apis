import * as dotenv from "dotenv";
import { Constants } from "../config/constants";
dotenv.config();

export class Utils {
    /** get skip and limit to avoid multiple code lines */
    public static getSkipLimit = (page: number, recordsPerPage: number = null) => {
        let skip = 0;
        const limit = recordsPerPage ? recordsPerPage : Constants.RECORDS_PER_PAGE; // for paginate records
        if (page) {
            skip = (page - 1) * limit;
        }
        return { limit, skip };
    }

    /** convert returned string from sql result to array by seperating comma */
    public static formatStringToArray = (result: any, type: string) => {
        if (result[type]) {
            if (result[type].indexOf(",") > 0) {
                result[type] = result[type].split(",");
            } else {
                result[type] = [result[type]];
            }
        } else {
            result[type] = [];
        }
        return result[type];
    }
}
