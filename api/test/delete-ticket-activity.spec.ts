import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryTicketsActivitiesRepository } from '@/repositories/in-memory/in-memory-ticket-activities-repository'
import { DeleteTicketActivityUseCase } from '@/use-cases/delete-ticket-activity'

let ticketActivitiesRepository: InMemoryTicketsActivitiesRepository
let sut: DeleteTicketActivityUseCase

describe('Delete Ticket Activity', () => {
  beforeEach(() => {
    ticketActivitiesRepository = new InMemoryTicketsActivitiesRepository()
    sut = new DeleteTicketActivityUseCase(ticketActivitiesRepository)
  })

  it('should be able to delete a ticket activity', async () => {
    const ticketActivity = await ticketActivitiesRepository.create({
      idticket: 'ticket-1',
      tipo: 'comment',
      descricao: 'O problema está sendo analisado pela equipe...',
      autor: 'John Doe Support',
      tempoGastoMinutos: 20,
    })

    await sut.execute({
      idactivity: ticketActivity.idactivity,
    })

    expect(ticketActivitiesRepository.items).toHaveLength(0)
  })
})
