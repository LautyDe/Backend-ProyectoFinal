import { ErrorName } from "./error.enum.js";

export default class CustomError {
  static createCustomError({ name = ErrorName.ERROR, message, cause, status }) {
    const customError = new Error(message, { cause });
    customError.name = name;
    customError.status = status;
    throw customError;
  }
}
