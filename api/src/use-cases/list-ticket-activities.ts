import type { TicketActivity } from '@/models/ticket-activity'
import type { TicketActivitiesRepository } from '@/repositories/ticket-activities-repository'

interface ListTicketActivitiesUseCaseRequest {
  idticket: string
  tipo?: string
  autor?: string
  page: number
  limit: number
}

interface ListTicketActivitiesUseCaseResponse {
  items: TicketActivity[]
  total: number
}

export class ListTicketActivitiesUseCase {
  constructor(private ticketActivitiesRepository: TicketActivitiesRepository) {}

  async execute({
    idticket,
    tipo,
    autor,
    page,
    limit,
  }: ListTicketActivitiesUseCaseRequest): Promise<ListTicketActivitiesUseCaseResponse> {
    const { items, total } = await this.ticketActivitiesRepository.findManyByTicketId({
      idticket,
      tipo,
      autor,
      page,
      limit,
    })

    return { items, total }
  }
}
