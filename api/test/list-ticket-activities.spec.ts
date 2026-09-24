import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryTicketsActivitiesRepository } from '@/repositories/in-memory/in-memory-ticket-activities-repository'
import { ListTicketActivitiesUseCase } from '@/use-cases/list-ticket-activities'

let ticketActivitiesRepository: InMemoryTicketsActivitiesRepository
let sut: ListTicketActivitiesUseCase

describe('List Ticket Activities', () => {
  beforeEach(() => {
    ticketActivitiesRepository = new InMemoryTicketsActivitiesRepository()
    sut = new ListTicketActivitiesUseCase(ticketActivitiesRepository)
  })

  it('should be able to list ticket activities', async () => {
    await ticketActivitiesRepository.create({
      idticket: 'ticket-1',
      tipo: 'comment',
      descricao: 'O problema está sendo analisado pela equipe...',
      autor: 'John Doe Support',
      tempoGastoMinutos: 20,
    })

    await ticketActivitiesRepository.create({
      idticket: 'ticket-1',
      tipo: 'diagnosis',
      descricao: 'O problema de acesso foi identificado pela equipe.',
      autor: 'John Doe Support',
      tempoGastoMinutos: 30,
    })

    await ticketActivitiesRepository.create({
      idticket: 'ticket-2',
      tipo: 'action',
      descricao: 'A senha do segundo usuário foi redefinida.',
      autor: 'John Doe Support',
      tempoGastoMinutos: 10,
    })

    const { items, total } = await sut.execute({
      idticket: 'ticket-1',
      page: 1,
      limit: 10,
    })

    expect(items).toHaveLength(2)
    expect(total).toEqual(2)
  })
})
