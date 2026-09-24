import { KnexTicketsRepository } from '@/repositories/knex/knex-tickets-repository'
import { GetTicketUseCase } from '@/use-cases/get-ticket'

export function makeGetTicketUseCase() {
  const ticketsRepository = new KnexTicketsRepository()
  const getTicketUseCase = new GetTicketUseCase(ticketsRepository)

  return getTicketUseCase
}
