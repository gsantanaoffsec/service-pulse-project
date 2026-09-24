import { KnexTicketsRepository } from '@/repositories/knex/knex-tickets-repository'
import { CreateTicketUseCase } from '@/use-cases/create-ticket'

export function makeCreateTicketUseCase() {
  const ticketsRepository = new KnexTicketsRepository()
  const createTicketUseCase = new CreateTicketUseCase(ticketsRepository)

  return createTicketUseCase
}
