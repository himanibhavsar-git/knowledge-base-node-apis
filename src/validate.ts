import { Model } from "./model";

export class Validator {
  // for validating body request
  public validate(arg: Model) {
    return (req: any, res: any, next: () => void) => {
      Model.getModel(arg, req.body, req.query).then((m2) => {
        req.model = m2;
        next();
      }).catch((err) => {
        // Refactor validation messages
        const error = err.length > 0 && err[0].constraints ?
          err[0].constraints[`${Object.keys(err[0].constraints)[0]}`] : err;
        return res.status(400).json({ error });
      });
    };
  }

  // for validating file type i.e checking file size
  public fileValidate(arg: any) {
    return (req: any, res: any, next: () => void) => {
      Model.getModel(arg, req.files, req.query).then((m2) => {
        req.model = m2;
        next();
      }).catch((err) => {
        // Refactor validation messages
        const error = err.length > 0 && err[0].constraints ?
          err[0].constraints[`${Object.keys(err[0].constraints)[0]}`] : err;
        return res.status(400).json({ error });
      });
    };
  }
}