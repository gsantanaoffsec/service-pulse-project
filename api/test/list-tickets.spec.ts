import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryTicketsRepository } from '@/repositories/in-memory/in-memory-tickets-repository'
import { ListTicketsUseCase } from '@/use-cases/list-tickets'

let ticketsRepository: InMemoryTicketsRepository
let sut: ListTicketsUseCase

describe('List Tickets', () => {
  beforeEach(() => {
    ticketsRepository = new InMemoryTicketsRepository()
    sut = new ListTicketsUseCase(ticketsRepository)
  })

  it('should be able to list tickets', async () => {
    await ticketsRepository.create({
      titulo: 'Problema de acesso ao sistema',
      descricao: 'O usuario não consegue acessar o sistema.',
      categoria: 'Access',
      prioridade: 'high',
      solicitante: 'John Doe',
    })

    await ticketsRepository.create({
      titulo: 'Problema de acesso ao sistema',
      descricao: 'O usuario não consegue acessar o sistema.',
      categoria: 'Access',
      prioridade: 'high',
      solicitante: 'John Doe',
    })

    const { items, total } = await sut.execute({
      page: 1,
      limit: 10,
    })

    expect(items).toHaveLength(2)
    expect(total).toEqual(2)
  })
})
