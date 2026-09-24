import { createTicketBodySchema } from '@/http/schemas/ticket-schema'
import { makeCreateTicketUseCase } from '@/use-cases/factories/make-create-ticket-use-case'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function create(request: FastifyRequest, reply: FastifyReply) {
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
  } = createTicketBodySchema.parse(request.body)

  const createTicketUseCase = makeCreateTicketUseCase()

  const { ticket } = await createTicketUseCase.execute({
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

  return reply.status(201).send({ ticket })
}
