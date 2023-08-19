import { codeGenerator } from "../../utils.js";

export default class TicketDTO {
  constructor(ticket) {
    this.code = codeGenerator();
    this.purchase_datetime = Date.now();
    this.amount = ticket.amount;
    this.purchaser = ticket.purchaser;
    this.products = ticket.products;
  }
}
