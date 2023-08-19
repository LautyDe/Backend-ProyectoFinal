import { ticketsModel } from "../../mongoDb/models/tickets.model.js";

class TicketManager {
  async createTicket() {
    const ticket = await ticketsModel.create();
    return ticket;
  }
}

export const ticketManager = new TicketManager();
