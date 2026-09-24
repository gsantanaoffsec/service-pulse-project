import { KnexTicketsRepository } from '@/repositories/knex/knex-tickets-repository'
import { ListTicketsUseCase } from '@/use-cases/list-tickets'

export function makeListTicketsUseCase() {
  const ticketsRepository = new KnexTicketsRepository()
  const listTicketsUseCase = new ListTicketsUseCase(ticketsRepository)

  return listTicketsUseCase
}
