import { ticketParamsSchema } from '@/http/schemas/params-schema'
import { makeDeleteTicketUseCase } from '@/use-cases/factories/make-delete-ticket-use-case'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function deleteTicket(request: FastifyRequest, reply: FastifyReply) {
  const { idticket } = ticketParamsSchema.parse(request.params)

  const deleteTicketUseCase = makeDeleteTicketUseCase()

  await deleteTicketUseCase.execute({
    idticket,
  })

  return reply.status(204).send()
}
