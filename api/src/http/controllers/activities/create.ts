import { activityTicketBodySchema } from '@/http/schemas/activity-schema'
import { ticketParamsSchema } from '@/http/schemas/params-schema'
import { makeCreateTicketActivityUseCase } from '@/use-cases/factories/make-create-ticket-activity-use-case'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function createTicketActivity(request: FastifyRequest, reply: FastifyReply) {
  const { idticket } = ticketParamsSchema.parse(request.params)

  const { tipo, descricao, autor, tempoGastoMinutos } = activityTicketBodySchema.parse(request.body)

  const createTicketActivityUseCase = makeCreateTicketActivityUseCase()

  const { ticketActivity } = await createTicketActivityUseCase.execute({
    idticket,
    tipo,
    descricao,
    autor,
    tempoGastoMinutos,
  })

  return reply.status(201).send({ ticketActivity })
}
