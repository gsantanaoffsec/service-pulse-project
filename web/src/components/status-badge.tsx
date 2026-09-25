interface StatusBadgeProps {
  status: string
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const labels: Record<string, string> = {
    open: 'Aberto',
    triage: 'Em triagem',
    in_progress: 'Em andamento',
    resolved: 'Resolvido',
    closed: 'Fechado',
  }

  const styles: Record<string, string> = {
    open: 'bg-status-open-soft text-status-open',
    triage: 'bg-status-triage-soft text-status-triage',
    in_progress: 'bg-status-progress-soft text-status-progress',
    resolved: 'bg-status-resolved-soft text-status-resolved',
    closed: 'bg-status-closed-soft text-status-closed',
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {labels[status]}
    </span>
  )
}
