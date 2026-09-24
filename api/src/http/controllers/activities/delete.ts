import type { FastifyReply, FastifyRequest } from 'fastify'

import { activityParamsSchema } from '@/http/schemas/params-schema'
import { makeDeleteTicketActivityUseCase } from '@/use-cases/factories/make-delete-ticket-activity-use-case'

export async function deleteTicketActivity(request: FastifyRequest, reply: FastifyReply) {
  const { idactivity } = activityParamsSchema.parse(request.params)

  const deleteTicketActivityUseCase = makeDeleteTicketActivityUseCase()

  await deleteTicketActivityUseCase.execute({
    idactivity,
  })

  return reply.status(204).send()
}
