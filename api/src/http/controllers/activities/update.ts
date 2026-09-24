import { activityTicketBodySchema } from '@/http/schemas/activity-schema'
import { activityParamsSchema } from '@/http/schemas/params-schema'
import { makeUpdateTicketActivityUseCase } from '@/use-cases/factories/make-update-ticket-activity-use-case'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function updateTicketActivity(request: FastifyRequest, reply: FastifyReply) {
  const { idactivity } = activityParamsSchema.parse(request.params)

  const { tipo, descricao, autor, tempoGastoMinutos } = activityTicketBodySchema.parse(request.body)

  const updateTicketActivityUseCase = makeUpdateTicketActivityUseCase()

  const { ticketActivity } = await updateTicketActivityUseCase.execute({
    idactivity,
    tipo,
    descricao,
    autor,
    tempoGastoMinutos,
  })

  return reply.status(200).send({ ticketActivity })
}
