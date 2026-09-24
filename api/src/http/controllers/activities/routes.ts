import { createTicketActivity } from '@/http/controllers/activities/create'
import { deleteTicketActivity } from '@/http/controllers/activities/delete'
import { details } from '@/http/controllers/activities/details'
import { listTicketActivities } from '@/http/controllers/activities/list'
import { updateTicketActivity } from '@/http/controllers/activities/update'
import type { FastifyInstance } from 'fastify'

export async function activitiesRoutes(app: FastifyInstance) {
  app.post('/tickets/:idticket/activities', createTicketActivity)
  app.get('/tickets/:idticket/activities', listTicketActivities)
  app.get('/activities/:idactivity', details)
  app.put('/activities/:idactivity', updateTicketActivity)
  app.delete('/activities/:idactivity', deleteTicketActivity)
}
