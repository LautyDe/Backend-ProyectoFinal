import { ticketsModel } from "../../mongoDb/models/tickets.model.js";

class TicketManager {
  async createTicket(obj) {
    const ticketM = await ticketsModel.create(obj);
    return ticketM;
  }
}

export const ticketManager = new TicketManager();
