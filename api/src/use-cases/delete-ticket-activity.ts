import type { TicketActivitiesRepository } from '@/repositories/ticket-activities-repository'
import { TicketActivityNotFoundError } from '@/use-cases/errors/ticket-activity-not-found-error'

interface DeleteTicketActivityUseCaseRequest {
  idactivity: string
}

export class DeleteTicketActivityUseCase {
  constructor(private ticketActivitiesRepository: TicketActivitiesRepository) {}

  async execute({ idactivity }: DeleteTicketActivityUseCaseRequest) {
    const activityExists = await this.ticketActivitiesRepository.findById(idactivity)

    if (!activityExists) {
      throw new TicketActivityNotFoundError()
    }

    await this.ticketActivitiesRepository.delete(idactivity)
  }
}
