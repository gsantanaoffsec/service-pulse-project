import type { FastifyReply, FastifyRequest } from 'fastify'

import { activityParamsSchema } from '@/http/schemas/params-schema'
import { makeGetTicketActivityUseCase } from '@/use-cases/factories/make-get-ticket-activity-use-case'

export async function details(request: FastifyRequest, reply: FastifyReply) {
  const { idactivity } = activityParamsSchema.parse(request.params)

  const getTicketActivityUseCase = makeGetTicketActivityUseCase()

  const { ticketActivity } = await getTicketActivityUseCase.execute({
    idactivity,
  })

  return reply.status(200).send({ ticketActivity })
}
