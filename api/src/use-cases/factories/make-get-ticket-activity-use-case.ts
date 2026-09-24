import { KnexTicketActivitiesRepository } from '@/repositories/knex/knex-ticket-activities-repository'
import { GetTicketActivityUseCase } from '@/use-cases/get-ticket-activity'

export function makeGetTicketActivityUseCase() {
  const ticketActivitiesRepository = new KnexTicketActivitiesRepository()
  const getTicketActivityUseCase = new GetTicketActivityUseCase(ticketActivitiesRepository)

  return getTicketActivityUseCase
}
