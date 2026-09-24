import type { FastifyReply, FastifyRequest } from 'fastify'

import { ticketParamsSchema } from '@/http/schemas/params-schema'
import { listTicketActivitiesQuerySchema } from '@/http/schemas/query-schema'
import { makeListTicketActivitiesUseCase } from '@/use-cases/factories/make-list-ticket-activities-use-case'

export async function listTicketActivities(request: FastifyRequest, reply: FastifyReply) {
  const { idticket } = ticketParamsSchema.parse(request.params)
  const { tipo, autor, _page, _limit } = listTicketActivitiesQuerySchema.parse(request.query)

  const listTicketActivitiesUseCase = makeListTicketActivitiesUseCase()

  const { items, total } = await listTicketActivitiesUseCase.execute({
    idticket,
    tipo,
    autor,
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
