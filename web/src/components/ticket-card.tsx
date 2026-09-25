import { Link } from 'react-router'
import { formatRelativeDate, formatTicketCode } from '../helpers/formatters'
import type { Ticket } from '../models/ticket'
import Icon from './icon'
import PriorityBadge from './priority-badge'
import StatusBadge from './status-badge'

interface TicketCardProps {
  ticket: Ticket
}

export default function TicketCard({ ticket }: TicketCardProps) {
  return (
    <Link
      className="group block rounded-2xl border border-border bg-white p-5 shadow-card transition duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-card-hover sm:p-6"
      to={`/tickets/${ticket.idticket}`}
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-medium text-text-muted">
            <span className="font-semibold tracking-wide text-primary">
              {formatTicketCode(ticket.idticket)}
            </span>
            <span className="h-1 w-1 rounded-full bg-border-strong" />
            <span>{formatRelativeDate(ticket.updatedAt)}</span>
          </div>

          <h2 className="mt-2 text-base font-semibold leading-6 text-text transition group-hover:text-primary sm:text-lg">
            {ticket.titulo}
          </h2>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.prioridade} />
            <span className="inline-flex items-center gap-1.5 px-1 text-xs font-medium text-text-muted">
              <Icon name="message" size={15} />
              {ticket.activitiesCount} {ticket.activitiesCount === 1 ? 'atividade' : 'atividades'}
            </span>
          </div>
        </div>

        <span className="hidden h-10 w-10 shrink-0 place-items-center rounded-xl bg-surface-subtle text-text-muted transition group-hover:bg-primary-soft group-hover:text-primary sm:grid">
          <Icon name="chevronRight" />
        </span>
      </div>
    </Link>
  )
}
