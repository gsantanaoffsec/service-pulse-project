import { KnexTicketActivitiesRepository } from '@/repositories/knex/knex-ticket-activities-repository'
import { UpdateTicketActivityUseCase } from '@/use-cases/update-ticket-activity'

export function makeUpdateTicketActivityUseCase() {
  const ticketActivitiesRepository = new KnexTicketActivitiesRepository()
  const updateTicketActivityUseCase = new UpdateTicketActivityUseCase(ticketActivitiesRepository)

  return updateTicketActivityUseCase
}
