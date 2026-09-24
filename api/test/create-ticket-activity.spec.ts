import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryTicketsActivitiesRepository } from '@/repositories/in-memory/in-memory-ticket-activities-repository'
import { InMemoryTicketsRepository } from '@/repositories/in-memory/in-memory-tickets-repository'
import { CreateTicketActivityUseCase } from '@/use-cases/create-ticket-activity'

let ticketRepository: InMemoryTicketsRepository
let ticketActivitiesRepository: InMemoryTicketsActivitiesRepository
let sut: CreateTicketActivityUseCase

describe('Create Ticket Activity', () => {
  beforeEach(() => {
    ticketRepository = new InMemoryTicketsRepository()
    ticketActivitiesRepository = new InMemoryTicketsActivitiesRepository()
    sut = new CreateTicketActivityUseCase(ticketActivitiesRepository, ticketRepository)
  })

  it('should be able to create a ticket activity', async () => {
    const ticket = await ticketRepository.create({
      titulo: 'Problema de acesso ao sistema',
      descricao: 'O usuario não consegue acessar o sistema.',
      categoria: 'Access',
      prioridade: 'high',
      solicitante: 'John Doe',
    })

    const { ticketActivity } = await sut.execute({
      idticket: ticket.idticket,
      tipo: 'comment',
      descricao: 'O problema está sendo analisado pela equipe...',
      autor: 'John Doe Support',
      tempoGastoMinutos: 20,
    })

    expect(ticketActivity.idactivity).toEqual(expect.any(String))
    expect(ticketActivity.idticket).toEqual(ticket.idticket)
    expect(ticketActivitiesRepository.items).toHaveLength(1)
  })
})
