import mongoose from "mongoose";
import config from "../../../config.js";

const documentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    reference: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const usersSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number },
  password: { type: String, required: true },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: "Carts", required: true },
  role: { type: String, default: config.role_user, required: true },
  documents: [documentSchema],
  last_connection: {
    type: Date,
  },
});

export const usersModel = mongoose.model("Users", usersSchema);
