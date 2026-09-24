import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryTicketsRepository } from '@/repositories/in-memory/in-memory-tickets-repository'
import { UpdateTicketUseCase } from '@/use-cases/update-ticket'

let ticketRepository: InMemoryTicketsRepository
let sut: UpdateTicketUseCase

describe('Update Ticket', () => {
  beforeEach(() => {
    ticketRepository = new InMemoryTicketsRepository()
    sut = new UpdateTicketUseCase(ticketRepository)
  })

  it('should be able to update a ticket', async () => {
    const createdTicket = await ticketRepository.create({
      titulo: 'Problema de acesso ao sistema',
      descricao: 'O usuario não consegue acessar o sistema.',
      categoria: 'Access',
      prioridade: 'high',
      solicitante: 'John Doe',
    })

    const { ticket } = await sut.execute({
      idticket: createdTicket.idticket,
      titulo: 'Problema de acesso corrigido.',
      descricao: 'O usuario voltou a acessar o sistema normalmente',
      categoria: 'Access',
      prioridade: 'low',
      status: 'resolved',
      solicitante: 'John Doe',
    })

    expect(ticket.titulo).toEqual('Problema de acesso corrigido.')
    expect(ticket.idticket).toEqual(createdTicket.idticket)
    // Verifica se a atualização foi realmente salva no array em memória
    expect(ticketRepository.items[0].titulo).toEqual('Problema de acesso corrigido.')
  })
})
