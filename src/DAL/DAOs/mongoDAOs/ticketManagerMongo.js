import { ticketsModel } from "../../mongoDb/models/tickets.model.js";

class TicketManager {
  async createTicket(obj) {
    console.log("obj desde manager", obj);
    const ticketM = await ticketsModel.create(obj);
    console.log("ticket desde Manager", ticketM);
    return ticketM;
  }
}

export const ticketManager = new TicketManager();
