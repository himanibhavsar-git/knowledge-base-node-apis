/* using this npm, please don't be offended it's just for my ease,
I can use sequelize but for this features I don't want to mess with migrations and all.
And on call I said I will use mongoose too but then it does not make sense to write queries with
 different db just to prove I know mongoDB or not.
You can test me by giving any mongoDB query test (Incase you have a doubt), I will not let you down :)
*/

import * as jmEzMySql from "jm-ez-mysql";

export class DB {
    public static init() {
        jmEzMySql.init({
            acquireTimeout: 100 * 60 * 1000,
            connectTimeout: 100 * 60 * 1000,
            connectionLimit: 10000,
            database: process.env.DATABASE,
            dateStrings: true,
            host: process.env.DBHOST,
            multipleStatements: true,
            password: process.env.DBPASSWORD,
            timeout: 100 * 60 * 1000,
            timezone: "utc",
            user: process.env.DBUSER,
        });
    }
}
