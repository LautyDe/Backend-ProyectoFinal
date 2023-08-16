import config from "../config.js";
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.gmail_user,
    pass: config.gmail_pass,
  },
});
 