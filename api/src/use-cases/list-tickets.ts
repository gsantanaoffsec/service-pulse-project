import type { TicketWithActivitiesCount } from '@/models/ticket'
import type { TicketsRepository } from '@/repositories/tickets-repository'

interface ListTicketsUseCaseRequest {
  q?: string
  status?: string
  categoria?: string
  prioridade?: string
  page: number
  limit: number
}

interface ListTicketsUseCaseResponse {
  items: TicketWithActivitiesCount[]
  total: number
}

export class ListTicketsUseCase {
  constructor(private ticketsRepository: TicketsRepository) {}

  async execute({
    q,
    status,
    categoria,
    prioridade,
    page,
    limit,
  }: ListTicketsUseCaseRequest): Promise<ListTicketsUseCaseResponse> {
    const { items, total } = await this.ticketsRepository.findMany({
      q,
      status,
      categoria,
      prioridade,
      page,
      limit,
    })

    return { items, total }
  }
}
