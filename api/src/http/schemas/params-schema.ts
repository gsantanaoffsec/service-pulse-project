import { z } from 'zod'

export const ticketParamsSchema = z.object({
  idticket: z.uuid(),
})

export const activityParamsSchema = z.object({
  idactivity: z.uuid(),
})
