import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryTicketsRepository } from '@/repositories/in-memory/in-memory-tickets-repository'
import { CreateTicketUseCase } from '@/use-cases/create-ticket'

let ticketsRepository: InMemoryTicketsRepository
let sut: CreateTicketUseCase

describe('Create Ticket Use Case', () => {
  // Antes de cada teste, o beforeEach() cria tudo novamente, n dxnd dados p/ o próximo teste
  beforeEach(() => {
    ticketsRepository = new InMemoryTicketsRepository()
    sut = new CreateTicketUseCase(ticketsRepository)
  })

  it('should be able to create a ticket', async () => {
    const { ticket } = await sut.execute({
      titulo: 'Problema de acesso ao sistema',
      descricao: 'O usuario não consegue acessar o sistema.',
      categoria: 'Access',
      prioridade: 'high',
      solicitante: 'John Doe',
    })

    expect(ticket.idticket).toEqual(expect.any(String))
    expect(ticket.status).toEqual('open')
    expect(ticketsRepository.items).toHaveLength(1)
  })
})
