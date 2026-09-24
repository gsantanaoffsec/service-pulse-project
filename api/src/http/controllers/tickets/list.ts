import { listTicketsQuerySchema } from '@/http/schemas/query-schema'
import { makeListTicketsUseCase } from '@/use-cases/factories/make-list-tickets-use-case'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function listTicket(request: FastifyRequest, reply: FastifyReply) {
  const { q, status, categoria, prioridade, _page, _limit } = listTicketsQuerySchema.parse(
    request.query,
  )

  const listTicketsUseCase = makeListTicketsUseCase()

  const { items, total } = await listTicketsUseCase.execute({
    q,
    status,
    categoria,
    prioridade,
    page: _page,
    limit: _limit,
  })

  return reply.status(200).send({
    items,
    page: _page,
    pageSize: _limit,
    total,
  })
}
