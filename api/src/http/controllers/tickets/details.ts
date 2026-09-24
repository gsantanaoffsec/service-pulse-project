import { ticketParamsSchema } from '@/http/schemas/params-schema'
import { makeGetTicketUseCase } from '@/use-cases/factories/make-get-ticket-use-case'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function details(request: FastifyRequest, reply: FastifyReply) {
  const { idticket } = ticketParamsSchema.parse(request.params)

  const getTicketUseCase = makeGetTicketUseCase()

  const { ticket } = await getTicketUseCase.execute({
    idticket,
  })

  return reply.status(200).send({ ticket })
}
