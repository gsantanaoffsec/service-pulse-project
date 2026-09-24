export class TicketActivityNotFoundError extends Error {
  constructor() {
    super('Ticket activity not found!')
  }
}
