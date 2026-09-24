import { z } from 'zod'

export const listTicketsQuerySchema = z.object({
  q: z.string().optional(),
  status: z.enum(['open', 'triage', 'in_progress', 'resolved', 'closed']).optional(),
  categoria: z.enum(['Access', 'Hardware', 'Software', 'Network', 'Security', 'Other']).optional(),
  prioridade: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  _page: z.coerce.number().int().min(1).default(1),
  _limit: z.coerce.number().int().min(1).max(100).default(10),
})

export const listTicketActivitiesQuerySchema = z.object({
  tipo: z.enum(['comment', 'diagnosis', 'action']).optional(),
  autor: z.string().optional(),
  _page: z.coerce.number().int().min(1).default(1),
  _limit: z.coerce.number().int().min(1).max(100).default(10),
})
