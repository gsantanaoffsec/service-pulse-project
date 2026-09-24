import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryTicketsActivitiesRepository } from '@/repositories/in-memory/in-memory-ticket-activities-repository'
import { UpdateTicketActivityUseCase } from '@/use-cases/update-ticket-activity'

let ticketActivitiesRepository: InMemoryTicketsActivitiesRepository
let sut: UpdateTicketActivityUseCase

describe('Update Ticket Activity', () => {
  beforeEach(() => {
    ticketActivitiesRepository = new InMemoryTicketsActivitiesRepository()
    sut = new UpdateTicketActivityUseCase(ticketActivitiesRepository)
  })

  it('should be able to update a ticket activity', async () => {
    const createdTicketActivity = await ticketActivitiesRepository.create({
      idticket: 'ticket-1',
      tipo: 'comment',
      descricao: 'O problema está sendo analisado pela equipe...',
      autor: 'John Doe Support',
      tempoGastoMinutos: 20,
    })

    const { ticketActivity } = await sut.execute({
      idactivity: createdTicketActivity.idactivity,
      tipo: 'diagnosis',
      descricao: 'O problema de acesso foi identificado pela equipe.',
      autor: 'John Doe Support',
      tempoGastoMinutos: 30,
    })

    expect(ticketActivity.tipo).toEqual('diagnosis')
    expect(ticketActivity.idactivity).toEqual(createdTicketActivity.idactivity)
  })
})
