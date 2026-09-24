import type { Ticket } from '@/models/ticket'
import type { TicketsRepository } from '@/repositories/tickets-repository'
import { TicketNotFoundError } from '@/use-cases/errors/ticket-not-found-error'

interface GetTicketUseCaseRequest {
  idticket: string
}

interface GetTicketUseCaseResponse {
  ticket: Ticket
}

export class GetTicketUseCase {
  constructor(private ticketsRepository: TicketsRepository) {}

  async execute({ idticket }: GetTicketUseCaseRequest): Promise<GetTicketUseCaseResponse> {
    const ticket = await this.ticketsRepository.findById(idticket)

    if (!ticket) {
      throw new TicketNotFoundError()
    }

    return { ticket }
  }
}
