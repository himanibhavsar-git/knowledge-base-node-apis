import * as aws from "aws-sdk";
import { Constants } from "../config/constants";
import * as path from "path";
import * as fs from "fs";
import * as uuid from "node-uuid";

export class MediaUpload {
    private static S3 = new aws.S3({ apiVersion: Constants.S3_API_VERSION });

    // upload file to S3 bucket
    public static async uploadFile(file: any) {
        const oldFilename = file.path;
        const fileName = file.name;
        const extension = path.extname(fileName);
        const data = fs.readFileSync(oldFilename);
        const newFilename = `${uuid.v1()}_original.${extension}`;
        const newPath = `${process.env.AWS_BUCKET_PATH}/${newFilename}`;
        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: newPath,
            ContentType: file.type,
            Body: data,
            ACL: "public-read"
        };
        return new Promise((resolve, reject) => {
            MediaUpload.S3.upload(params, (_err: any, _result: any) => {
                if (_err) {
                    reject(_err);
                } else {
                    resolve(_result);
                }
            });
        });

    }
}

