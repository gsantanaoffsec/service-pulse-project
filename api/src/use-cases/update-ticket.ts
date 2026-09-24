import type { Ticket } from '@/models/ticket'
import type { TicketsRepository } from '@/repositories/tickets-repository'
import { TicketNotFoundError } from '@/use-cases/errors/ticket-not-found-error'

interface UpdateTicketUseCaseRequest {
  idticket: string
  titulo: string
  descricao: string
  categoria: string
  prioridade: string
  status: string
  solicitante: string
  responsavel?: string | null
  tipoResolucao?: string | null
  resumoResolucao?: string | null
}

interface UpdateTicketUseCaseResponse {
  ticket: Ticket
}

export class UpdateTicketUseCase {
  constructor(private ticketsRepository: TicketsRepository) {}

  async execute({
    idticket,
    titulo,
    descricao,
    categoria,
    prioridade,
    status,
    solicitante,
    responsavel,
    tipoResolucao,
    resumoResolucao,
  }: UpdateTicketUseCaseRequest): Promise<UpdateTicketUseCaseResponse> {
    const ticketExists = await this.ticketsRepository.findById(idticket)

    if (!ticketExists) {
      throw new TicketNotFoundError()
    }

    const now = new Date().toISOString()
    let resolvedAt = ticketExists.resolvedAt
    let closedAt = ticketExists.closedAt

    if (status === 'resolved' && !resolvedAt) {
      resolvedAt = now
    }

    if (status === 'closed') {
      if (!resolvedAt) {
        resolvedAt = now
      }

      if (!closedAt) {
        closedAt = now
      }
    }

    const ticket = await this.ticketsRepository.update(idticket, {
      titulo,
      descricao,
      categoria,
      prioridade,
      status,
      solicitante,
      responsavel,
      tipoResolucao,
      resumoResolucao,
      resolvedAt,
      closedAt,
    })

    return { ticket }
  }
}
