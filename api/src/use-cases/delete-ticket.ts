import type { TicketsRepository } from '@/repositories/tickets-repository'
import { TicketNotFoundError } from '@/use-cases/errors/ticket-not-found-error'

interface DeleteTicketUseCaseRequest {
  idticket: string
}

export class DeleteTicketUseCase {
  constructor(private ticketsRepository: TicketsRepository) {}

  async execute({ idticket }: DeleteTicketUseCaseRequest) {
    const ticketExists = await this.ticketsRepository.findById(idticket)

    if (!ticketExists) {
      throw new TicketNotFoundError()
    }

    await this.ticketsRepository.delete(idticket)
  }
}
