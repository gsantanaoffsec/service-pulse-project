import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryTicketsRepository } from '@/repositories/in-memory/in-memory-tickets-repository'
import { GetTicketUseCase } from '@/use-cases/get-ticket'

let ticketsRepository: InMemoryTicketsRepository
let sut: GetTicketUseCase

describe('Get Specific Ticket', () => {
  beforeEach(() => {
    ticketsRepository = new InMemoryTicketsRepository()
    sut = new GetTicketUseCase(ticketsRepository)
  })

  it('should be able to get a ticket based on id', async () => {
    const createdTicket = await ticketsRepository.create({
      titulo: 'Problema de acesso ao sistema',
      descricao: 'O usuario não consegue acessar o sistema.',
      categoria: 'Access',
      prioridade: 'high',
      solicitante: 'John Doe',
    })

    const { ticket } = await sut.execute({
      idticket: createdTicket.idticket,
    })

    expect(ticket.idticket).toEqual(createdTicket.idticket)
  })
})
