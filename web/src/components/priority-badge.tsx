interface PriorityBadgeProps {
  priority: string
}

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  const labels: Record<string, string> = {
    low: 'Baixa',
    medium: 'Média',
    high: 'Alta',
    critical: 'Crítica',
  }

  const styles: Record<string, string> = {
    low: 'bg-priority-low-soft text-priority-low',
    medium: 'bg-priority-medium-soft text-priority-medium',
    high: 'bg-priority-high-soft text-priority-high',
    critical: 'bg-priority-critical-soft text-priority-critical',
  }

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[priority]}`}
    >
      {labels[priority]}
    </span>
  )
}
