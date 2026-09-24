import { KnexTicketActivitiesRepository } from '@/repositories/knex/knex-ticket-activities-repository'
import { DeleteTicketActivityUseCase } from '@/use-cases/delete-ticket-activity'

export function makeDeleteTicketActivityUseCase() {
  const ticketActivitiesRepository = new KnexTicketActivitiesRepository()
  const deleteTicketActivityUseCase = new DeleteTicketActivityUseCase(ticketActivitiesRepository)

  return deleteTicketActivityUseCase
}
