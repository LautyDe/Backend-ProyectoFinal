import mongoose from "mongoose";
import { codeGenerator } from "../../../utils.js";

const ticketsSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  purchase_datetime: { type: Date, default: Date.now, required: true },
  amount: { type: Number, required: true },
  purchaser: { type: String, required: true },
});

export const ticketsModel = mongoose.model("Tickets", ticketsSchema);
