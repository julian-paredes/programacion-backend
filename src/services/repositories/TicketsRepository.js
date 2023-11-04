
export default class TicketRepository {
    constructor(dao) {
      this.dao = dao;
    }
    getTickets = () => {
      return this.dao.getTickets();
    };
  
    getTicketById = () => {
      return this.dao.getTicketById(params);
    };
    createTicket = (newTicket) => {
      return this.dao.createTicket(newTicket);
    };
  }