import { KnexTicketsRepository } from '@/repositories/knex/knex-tickets-repository'
import { DeleteTicketUseCase } from '@/use-cases/delete-ticket'

export function makeDeleteTicketUseCase() {
  const ticketsRepository = new KnexTicketsRepository()
  const deleteTicketUseCase = new DeleteTicketUseCase(ticketsRepository)

  return deleteTicketUseCase
}
