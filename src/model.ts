import { validate } from "class-validator";

export class Model {
  // Validating body requests as models
  public static async getModel(model: any, body: any, query?: any): Promise<Model> {
    try {
      const modelInstance = new model(body, query);
      const errors = await validate(modelInstance);
      if (errors.length) {
        throw errors;
      }
      return modelInstance;
    } catch (error) {
      throw error;
    }
  }
}
