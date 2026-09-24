import type { TicketActivity } from '@/models/ticket-activity'
import type { TicketActivitiesRepository } from '@/repositories/ticket-activities-repository'
import type { TicketsRepository } from '@/repositories/tickets-repository'
import { TicketNotFoundError } from '@/use-cases/errors/ticket-not-found-error'

interface CreateTicketActivityUseCaseRequest {
  idticket: string
  tipo: string
  descricao: string
  autor: string
  tempoGastoMinutos?: number | null
}

interface CreateTicketActivityUseCaseResponse {
  ticketActivity: TicketActivity
}

export class CreateTicketActivityUseCase {
  constructor(
    private ticketActivitiesRepository: TicketActivitiesRepository,
    private ticketsRepository: TicketsRepository,
  ) {}

  async execute({
    idticket,
    tipo,
    descricao,
    autor,
    tempoGastoMinutos,
  }: CreateTicketActivityUseCaseRequest): Promise<CreateTicketActivityUseCaseResponse> {
    const ticketExists = await this.ticketsRepository.findById(idticket)

    if (!ticketExists) {
      throw new TicketNotFoundError()
    }

    const ticketActivity = await this.ticketActivitiesRepository.create({
      idticket,
      tipo,
      descricao,
      autor,
      tempoGastoMinutos,
    })

    return { ticketActivity }
  }
}
