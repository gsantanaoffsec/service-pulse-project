import cors from '@fastify/cors'
import fastify from 'fastify'
import { ZodError } from 'zod'

import { activitiesRoutes } from '@/http/controllers/activities/routes'
import { ticketsRoutes } from '@/http/controllers/tickets/routes'
import { TicketActivityNotFoundError } from '@/use-cases/errors/ticket-activity-not-found-error'
import { TicketNotFoundError } from '@/use-cases/errors/ticket-not-found-error'

export const app = fastify()

app.register(cors, {
  origin: true,
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE'],
})

app.register(ticketsRoutes)
app.register(activitiesRoutes)

app.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error.',
      issues: error.issues,
    })
  }

  if (error instanceof TicketNotFoundError || error instanceof TicketActivityNotFoundError) {
    return reply.status(404).send({
      message: error.message,
    })
  }

  if (
    error instanceof Error &&
    'code' in error &&
    typeof error.code === 'string' &&
    error.code.startsWith('SQLITE_CONSTRAINT')
  ) {
    return reply.status(409).send({
      message: 'Database conflict.',
    })
  }

  request.log.error(error)

  return reply.status(500).send({
    message: 'Internal server error.',
  })
})
