import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryTicketsRepository } from '@/repositories/in-memory/in-memory-tickets-repository'
import { DeleteTicketUseCase } from '@/use-cases/delete-ticket'

let ticketsRepository: InMemoryTicketsRepository
let sut: DeleteTicketUseCase

describe('Delete Ticket', () => {
  beforeEach(() => {
    ticketsRepository = new InMemoryTicketsRepository()
    sut = new DeleteTicketUseCase(ticketsRepository)
  })

  it('should be able to delete a ticket', async () => {
    const ticket = await ticketsRepository.create({
      titulo: 'Problema de acesso ao sistema',
      descricao: 'O usuario não consegue acessar o sistema.',
      categoria: 'Access',
      prioridade: 'high',
      solicitante: 'John Doe',
    })

    await sut.execute({
      idticket: ticket.idticket,
    })

    expect(ticketsRepository.items).toHaveLength(0)
  })
})
