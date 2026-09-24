import { KnexTicketsRepository } from '@/repositories/knex/knex-tickets-repository'
import { UpdateTicketUseCase } from '@/use-cases/update-ticket'

export function makeUpdateTicketUseCase() {
  const ticketsRepository = new KnexTicketsRepository()
  const updateTicketUseCase = new UpdateTicketUseCase(ticketsRepository)

  return updateTicketUseCase
}
