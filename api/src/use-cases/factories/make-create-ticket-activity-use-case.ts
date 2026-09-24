import { KnexTicketActivitiesRepository } from '@/repositories/knex/knex-ticket-activities-repository'
import { KnexTicketsRepository } from '@/repositories/knex/knex-tickets-repository'
import { CreateTicketActivityUseCase } from '@/use-cases/create-ticket-activity'

export function makeCreateTicketActivityUseCase() {
  const ticketActivitiesRepository = new KnexTicketActivitiesRepository()
  const ticketsRepository = new KnexTicketsRepository()

  const createTicketActivityUseCase = new CreateTicketActivityUseCase(
    ticketActivitiesRepository,
    ticketsRepository,
  )

  return createTicketActivityUseCase
}
