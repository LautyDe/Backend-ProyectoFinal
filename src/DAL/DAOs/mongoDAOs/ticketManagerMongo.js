import { ticketsModel } from "../../mongoDb/models/tickets.model.js";

class TicketManager {
  async createTicket(obj) {
    const ticket = await ticketsModel.create(obj);
    return ticket;
  }
}

export const ticketManager = new TicketManager();
