import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryTicketsActivitiesRepository } from '@/repositories/in-memory/in-memory-ticket-activities-repository'
import { GetTicketActivityUseCase } from '@/use-cases/get-ticket-activity'

let ticketActivitiesRepository: InMemoryTicketsActivitiesRepository
let sut: GetTicketActivityUseCase

describe('Get Ticket Activity', () => {
  beforeEach(() => {
    ticketActivitiesRepository = new InMemoryTicketsActivitiesRepository()
    sut = new GetTicketActivityUseCase(ticketActivitiesRepository)
  })

  it('should be able to get a ticket activity based on id', async () => {
    const createdTicketActivity = await ticketActivitiesRepository.create({
      idticket: 'ticket-1',
      tipo: 'comment',
      descricao: 'O problema está sendo analisado pela equipe...',
      autor: 'John Doe Support',
      tempoGastoMinutos: 20,
    })

    const { ticketActivity } = await sut.execute({
      idactivity: createdTicketActivity.idactivity,
    })

    expect(ticketActivity.idactivity).toEqual(createdTicketActivity.idactivity)
  })
})
