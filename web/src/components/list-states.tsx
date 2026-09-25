import Button from './button'
import Icon from './icon'

interface ErrorStateProps {
  onRetry: () => void
  compact?: boolean
  message?: string
}

export function TicketListSkeleton() {
  return (
    <div aria-label="Carregando chamados" className="space-y-3" role="status">
      {[1, 2, 3, 4].map((skeletonNumber) => (
        <div
          className="animate-pulse rounded-2xl border border-border bg-white p-5"
          key={skeletonNumber}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="h-3 w-28 rounded bg-skeleton" />
            <div className="h-6 w-24 rounded-full bg-skeleton" />
          </div>
          <div className="mt-5 h-5 w-3/5 rounded bg-skeleton" />
          <div className="mt-4 flex gap-2">
            <div className="h-6 w-20 rounded-full bg-skeleton" />
            <div className="h-6 w-24 rounded-full bg-skeleton" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function ActivityListSkeleton() {
  return (
    <div aria-label="Carregando atividades" className="space-y-7" role="status">
      {[1, 2, 3].map((skeletonNumber) => (
        <div className="flex animate-pulse gap-4" key={skeletonNumber}>
          <div className="h-10 w-10 shrink-0 rounded-full bg-skeleton" />
          <div className="flex-1 space-y-3 pt-1">
            <div className="h-3 w-32 rounded bg-skeleton" />
            <div className="h-4 w-full rounded bg-skeleton" />
            <div className="h-4 w-2/3 rounded bg-skeleton" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function EmptyState({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`grid place-items-center rounded-2xl border border-dashed border-border bg-white px-6 text-center ${compact ? 'py-12' : 'py-18'}`}
    >
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-surface-subtle text-text-muted">
        <Icon name="inbox" size={26} />
      </span>
      <h3 className="mt-4 text-base font-semibold text-text">Nenhum chamado encontrado</h3>
      <p className="mt-1 max-w-sm text-sm leading-6 text-text-muted">
        Ajuste os filtros ou tente buscar por outro termo.
      </p>
    </div>
  )
}

export function EmptyActivitiesState() {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-border bg-surface-subtle px-6 py-12 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-text-muted shadow-card">
        <Icon name="message" size={22} />
      </span>
      <h3 className="mt-4 text-sm font-semibold text-text">Nenhuma atividade registrada</h3>
      <p className="mt-1 text-sm text-text-muted">O histórico deste chamado aparecerá aqui.</p>
    </div>
  )
}

export function ErrorState({
  onRetry,
  compact = false,
  message = 'Houve uma falha inesperada. Verifique sua conexão e tente novamente.',
}: ErrorStateProps) {
  return (
    <div
      className={`grid place-items-center rounded-2xl border border-danger/20 bg-danger-soft px-6 text-center ${compact ? 'py-10' : 'py-16'}`}
    >
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-danger shadow-card">
        <Icon name="alert" size={23} />
      </span>
      <h3 className="mt-4 text-base font-semibold text-text">Não foi possível carregar os dados</h3>
      <p className="mt-1 max-w-sm text-sm leading-6 text-text-muted">{message}</p>
      <Button className="mt-5" icon="refresh" onClick={onRetry} size="sm" variant="secondary">
        Tentar novamente
      </Button>
    </div>
  )
}
