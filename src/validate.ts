import { Model } from "./model";

export class Validator {
  // for validating body request
  public validate(arg: Model) {
    // tslint:disable-next-line:only-arrow-functions space-before-function-paren
    return function (req: { body: any; query: any; model: Model; t: (arg0: any) => { (): any; new(): any; length: number; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: any; code: number; }): any; new(): any; }; }; }, next: () => void) {
      Model.getModel(arg, req.body, req.query).then((m2) => {
        req.model = m2;
        next();
      }).catch((err) => {
        // Refactor validation messages
        const error = err.length > 0 && err[0].constraints ?
          err[0].constraints[`${Object.keys(err[0].constraints)[0]}`] : err;
        const errMessage = req.t(error).length > 0 ? req.t(error) : error;
        return res.status(400).json({ error: errMessage, code: 400 });
      });
    };
  }

  // for validating file type i.e checking file size
  public fileValidate(arg: Model) {
    // tslint:disable-next-line:only-arrow-functions space-before-function-paren
    return function (req: { files: any; query: any; model: Model; t: (arg0: any) => { (): any; new(): any; length: number; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: any; code: number; }): any; new(): any; }; }; }, next: () => void) {
      Model.getModel(arg, req.files, req.query).then((m2) => {
        req.model = m2;
        next();
      }).catch((err) => {
        // Refactor validation messages
        const error = err.length > 0 && err[0].constraints ?
          err[0].constraints[`${Object.keys(err[0].constraints)[0]}`] : err;
        const errMessage = req.t(error).length > 0 ? req.t(error) : error;
        return res.status(400).json({ error: errMessage, code: 400 });
      });
    };
  }
}