import { z } from 'zod'

const ticketStatusSchema = z.enum(['open', 'triage', 'in_progress', 'resolved', 'closed'])

const ticketCategorySchema = z.enum([
  'Access',
  'Hardware',
  'Software',
  'Network',
  'Security',
  'Other',
])

const ticketPrioritySchema = z.enum(['low', 'medium', 'high', 'critical'])

const ticketResolutionTypeSchema = z.enum([
  'fixed',
  'workaround',
  'no_issue',
  'duplicate',
  'cancelled',
])

const ticketBodySchema = z.object({
  titulo: z.string().min(5),
  descricao: z.string().min(20),
  categoria: ticketCategorySchema,
  prioridade: ticketPrioritySchema,
  status: ticketStatusSchema,
  solicitante: z.string(),
  responsavel: z.string().min(1).nullable().optional(),
  tipoResolucao: ticketResolutionTypeSchema.nullable().optional(),
  resumoResolucao: z.string().min(10).nullable().optional(),
})

function validateTicketStatus(ticket: z.infer<typeof ticketBodySchema>, context: z.RefinementCtx) {
  const requiresResponsible = ['in_progress', 'resolved', 'closed'].includes(ticket.status)

  if (requiresResponsible && !ticket.responsavel) {
    context.addIssue({
      code: 'custom',
      message: 'Responsible is required for the current status.',
      path: ['responsavel'],
    })
  }

  const requiresResolution = ticket.status === 'resolved' || ticket.status === 'closed'

  if (requiresResolution && !ticket.tipoResolucao) {
    context.addIssue({
      code: 'custom',
      message: 'Resolution type is required for the current status.',
      path: ['tipoResolucao'],
    })
  }

  if (requiresResolution && !ticket.resumoResolucao) {
    context.addIssue({
      code: 'custom',
      message: 'Resolution summary is required for the current status.',
      path: ['resumoResolucao'],
    })
  }
}

export const createTicketBodySchema = ticketBodySchema
  .extend({
    status: ticketStatusSchema.default('open'),
  })
  .superRefine(validateTicketStatus)

export const updateTicketBodySchema = ticketBodySchema.superRefine(validateTicketStatus)
