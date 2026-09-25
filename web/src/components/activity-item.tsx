import { Link } from 'react-router'
import { formatTime } from '../helpers/formatters'
import type { TicketActivity } from '../models/ticket'
import Icon from './icon'

interface ActivityItemProps {
  activity: TicketActivity
  onDelete: (activity: TicketActivity) => void
}

export default function ActivityItem({ activity, onDelete }: ActivityItemProps) {
  const labels: Record<string, string> = {
    comment: 'Comentário',
    diagnosis: 'Diagnóstico',
    action: 'Ação',
  }

  const styles: Record<string, string> = {
    comment: 'bg-activity-comment-soft text-activity-comment',
    diagnosis: 'bg-activity-diagnosis-soft text-activity-diagnosis',
    action: 'bg-activity-action-soft text-activity-action',
  }

  const icons: Record<string, string> = {
    comment: 'message',
    diagnosis: 'search',
    action: 'check',
  }

  return (
    <article className="relative flex gap-4 pb-8 last:pb-0">
      <div className="absolute bottom-0 left-5 top-10 w-px bg-border last:hidden" />
      <span
        className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full ${styles[activity.tipo]}`}
      >
        <Icon name={icons[activity.tipo]} size={18} />
      </span>

      <div className="min-w-0 flex-1 rounded-2xl border border-border bg-white p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-text">{labels[activity.tipo]}</span>
            <span className="text-xs text-text-soft">•</span>
            <time className="text-xs font-medium text-text-muted">
              {formatTime(activity.createdAt)}
            </time>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <Link
              aria-label="Editar atividade"
              className="grid h-8 w-8 place-items-center rounded-lg text-text-soft transition hover:bg-surface-subtle hover:text-text"
              to={`/tickets/${activity.idticket}/activities/${activity.idactivity}/edit`}
            >
              <Icon name="edit" size={16} />
            </Link>
            <button
              aria-label="Excluir atividade"
              className="grid h-8 w-8 place-items-center rounded-lg text-text-soft transition hover:bg-danger-soft hover:text-danger"
              onClick={() => onDelete(activity)}
              type="button"
            >
              <Icon name="trash" size={16} />
            </button>
          </div>
        </div>

        <p className="mt-3 text-sm leading-6 text-text-muted">{activity.descricao}</p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border/70 pt-3 text-xs text-text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Icon name="user" size={14} />
            {activity.autor}
          </span>
          {activity.tempoGastoMinutos !== null && (
            <span className="inline-flex items-center gap-1.5">
              <Icon name="clock" size={14} />
              {activity.tempoGastoMinutos} min
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
