import { KnexTicketActivitiesRepository } from '@/repositories/knex/knex-ticket-activities-repository'
import { ListTicketActivitiesUseCase } from '@/use-cases/list-ticket-activities'

export function makeListTicketActivitiesUseCase() {
  const ticketActivitiesRepository = new KnexTicketActivitiesRepository()
  const listTicketActivitiesUseCase = new ListTicketActivitiesUseCase(ticketActivitiesRepository)

  return listTicketActivitiesUseCase
}
