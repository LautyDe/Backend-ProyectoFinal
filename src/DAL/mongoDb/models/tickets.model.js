import mongoose from "mongoose";

const ticketsSchema = new mongoose.Schema({
  code: {
    type: mongoose.SchemaTypes.ObjectId,
    default: new mongoose.Types.ObjectId(),
    required: true,
  },
  purchase_datetime: { type: Date, default: Date.now, required: true },
  amount: { type: Number, required: true },
  purchaser: { type: String, required: true },
});

export const ticketsModel = mongoose.model("Tickets", ticketsSchema);
