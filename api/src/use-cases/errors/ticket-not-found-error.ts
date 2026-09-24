export class TicketNotFoundError extends Error {
  constructor() {
    super('Ticket not found!')
  }
}
