import { create } from '@/http/controllers/tickets/create'
import { deleteTicket } from '@/http/controllers/tickets/delete'
import { details } from '@/http/controllers/tickets/details'
import { listTicket } from '@/http/controllers/tickets/list'
import { updateTicket } from '@/http/controllers/tickets/update'
import type { FastifyInstance } from 'fastify'

export async function ticketsRoutes(app: FastifyInstance) {
  app.post('/tickets', create)
  app.get('/tickets', listTicket)
  app.get('/tickets/:idticket', details)
  app.put('/tickets/:idticket', updateTicket)
  app.delete('/tickets/:idticket', deleteTicket)
}
