import { dirname } from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import config from "./config.js";
import { cartsService } from "./services/carts.service.js";
import CustomError from "./services/errors/CustomError.js";
import { ErrorMessage } from "./services/errors/error.enum.js";

export const __dirname = dirname(fileURLToPath(import.meta.url));

export const hashData = data => {
  return bcrypt.hash(data, 10);
};

export const compareData = async (data, dataDB) => {
  return bcrypt.compare(data, dataDB);
};

export const passwordGenerator = async (codeLength = 15) => {
  const secret_password = config.secret_password;
  let code = "";
  for (let i = 0; i < codeLength; i++) {
    const random = Math.floor(Math.random() * secret_password.length);
    code += secret_password.charAt(random);
  }
  return code;
};

export const paramsValidator = async product => {
  if (
    product.title &&
    product.description &&
    product.price &&
    product.stock &&
    product.category &&
    !product.id &&
    !product.code
  ) {
    return product;
  } else {
    if (!product.title) {
      throw CustomError.createCustomError({
        message: ErrorMessage.INTERNAL_SERVER_ERROR,
        status: 400,
      });
    } else if (!product.description) {
      throw CustomError.createCustomError({
        message: "Falta la descripcion del producto.",
        status: 400,
      });
    } else if (!product.price) {
      throw CustomError.createCustomError({
        message: "Falta el precio del producto.",
        status: 400,
      });
    } else if (!product.stock) {
      throw CustomError.createCustomError({
        message: "Falta stock del producto.",
        status: 400,
      });
    } else if (!product.category) {
      throw CustomError.createCustomError({
        message: "Falta la categoria del producto.",
        status: 400,
      });
    } else if (product.id) {
      throw CustomError.createCustomError({
        message: "El producto no se debe cargar con el id.",
        status: 400,
      });
    } else if (product.code) {
      throw CustomError.createCustomError({
        message: "El producto no se debe cargar con el code.",
        status: 400,
      });
    }
  }
};

export const codeGenerator = (codeLength = 15) => {
  const numeros = "0123456789";
  const letras = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numYLetras = numeros + letras;
  let code = "";
  for (let i = 0; i < codeLength; i++) {
    const random = Math.floor(Math.random() * numYLetras.length);
    code += numYLetras.charAt(random);
  }
  return code;
};

export const lessThanOneHour = timestamp => {
  const hourInMs = 60 * 60 * 1000;
  const currentTimestamp = new Date().getTime();
  const diff = currentTimestamp - timestamp;
  return diff < hourInMs;
};

export const resetPasswordLink = userId => {
  const baseUrl = "http://localhost:8080/users";
  const token = encodeURIComponent(
    Buffer.from(new Date().getTime().toString()).toString("base64")
  );
  return `${baseUrl}/changePassPage?token=${token}&uid=${userId}`;
};
