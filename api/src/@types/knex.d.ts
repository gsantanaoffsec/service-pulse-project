import type { Ticket } from '@/models/ticket'
import type { TicketActivity } from '@/models/ticket-activity'

declare module 'knex/types/tables' {
  interface Tables {
    tickets: Ticket
    ticket_activities: TicketActivity
  }
}
