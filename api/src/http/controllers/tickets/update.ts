import { ticketParamsSchema } from '@/http/schemas/params-schema'
import { updateTicketBodySchema } from '@/http/schemas/ticket-schema'
import { makeUpdateTicketUseCase } from '@/use-cases/factories/make-update-ticket-use-case'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function updateTicket(request: FastifyRequest, reply: FastifyReply) {
  const { idticket } = ticketParamsSchema.parse(request.params)

  const {
    titulo,
    descricao,
    categoria,
    prioridade,
    status,
    solicitante,
    responsavel,
    tipoResolucao,
    resumoResolucao,
  } = updateTicketBodySchema.parse(request.body)

  const updateTicketUseCase = makeUpdateTicketUseCase()

  const { ticket } = await updateTicketUseCase.execute({
    idticket,
    titulo,
    descricao,
    categoria,
    prioridade,
    status,
    solicitante,
    responsavel,
    tipoResolucao,
    resumoResolucao,
  })

  return reply.status(200).send({ ticket })
}
