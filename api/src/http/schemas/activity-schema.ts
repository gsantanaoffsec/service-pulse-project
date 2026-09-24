import { z } from 'zod'

export const activityTicketBodySchema = z.object({
  tipo: z.enum(['comment', 'diagnosis', 'action']),
  descricao: z.string().min(10),
  autor: z.string().min(2),
  tempoGastoMinutos: z.number().int().min(0).max(1440).optional(),
})
