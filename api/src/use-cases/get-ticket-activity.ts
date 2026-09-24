import type { TicketActivity } from '@/models/ticket-activity'
import type { TicketActivitiesRepository } from '@/repositories/ticket-activities-repository'
import { TicketActivityNotFoundError } from '@/use-cases/errors/ticket-activity-not-found-error'

interface GetTicketActivityUseCaseRequest {
  idactivity: string
}

interface GetTicketActivityUseCaseResponse {
  ticketActivity: TicketActivity
}

export class GetTicketActivityUseCase {
  constructor(private ticketActivitiesRepository: TicketActivitiesRepository) {}

  async execute({
    idactivity,
  }: GetTicketActivityUseCaseRequest): Promise<GetTicketActivityUseCaseResponse> {
    const ticketActivity = await this.ticketActivitiesRepository.findById(idactivity)

    if (!ticketActivity) {
      throw new TicketActivityNotFoundError()
    }

    return { ticketActivity }
  }
}
