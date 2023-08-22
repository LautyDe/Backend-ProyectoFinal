import multer from "multer";
import { __dirname } from "../utils.js";

const PROFILE = "profile";
const PRODUCT = "product";
const DOCUMENT = "document";
const FileTypes = [PROFILE, PRODUCT, DOCUMENT];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const type = file.originalname.split(".")[0];
    const destDir = FileTypes.includes(type) ? type : DOCUMENT;
    cb(null, `${__dirname}/public/uploads/${destDir}`);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const uploader = multer({ storage });
