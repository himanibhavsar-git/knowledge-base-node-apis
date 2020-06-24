
export class Constants {
    public static readonly RECORDS_PER_PAGE = 10;
    public static readonly IMAGE_MIMES = ["image/jpeg", "image/jpg", "image/png"];
    public static readonly IMAGE_TYPES = [".jpeg", ".jpg", ".png"];
    public static readonly PASSWORD_HASH = 12;
    public static readonly SIGNUP_TYPES = {
        EMAIL: "email",
        SOCIAL: "social",
    };
    public static readonly S3_API_VERSION = "2006-03-01";
    public static readonly UPLOAD_SIZES = { IMAGE: 1000000 };
}
