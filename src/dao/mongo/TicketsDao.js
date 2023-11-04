import ticketsModel from "./models/tickets.js";

export default class TicketsDao {

    getTickets = (params) => {
      return  ticketsModel.find(params).lean();
    };
    getTicketById = (params) => {
      return ticketsModel.findOne(params).populate("carts.cart");
    };
    createTicket = (newTicket) => {
      return ticketsModel.create(newTicket);
    };
  }