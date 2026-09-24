import type { Ticket } from '@/models/ticket'
import type { TicketsRepository } from '@/repositories/tickets-repository'

interface CreateTicketUseCaseRequest {
  titulo: string
  descricao: string
  categoria: string
  prioridade: string
  status?: string
  solicitante: string
  responsavel?: string | null
  tipoResolucao?: string | null
  resumoResolucao?: string | null
}

interface CreateTicketUseCaseResponse {
  ticket: Ticket
}

export class CreateTicketUseCase {
  constructor(private ticketsRepository: TicketsRepository) {}

  async execute({
    titulo,
    descricao,
    categoria,
    prioridade,
    status,
    solicitante,
    responsavel,
    tipoResolucao,
    resumoResolucao,
  }: CreateTicketUseCaseRequest): Promise<CreateTicketUseCaseResponse> {
    const now = new Date().toISOString()
    const ticketStatus = status ?? 'open'
    const resolvedAt = ticketStatus === 'resolved' || ticketStatus === 'closed' ? now : null
    const closedAt = ticketStatus === 'closed' ? now : null

    const ticket = await this.ticketsRepository.create({
      titulo,
      descricao,
      categoria,
      prioridade,
      status: ticketStatus,
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
