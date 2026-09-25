export function formatTicketCode(idticket: string) {
  return `#${idticket.slice(0, 8).toUpperCase()}`
}

export function formatRelativeDate(date: string) {
  const difference = Date.now() - new Date(date).getTime()
  const hours = Math.max(1, Math.floor(difference / 3_600_000))

  if (hours < 24) {
    return `há ${hours}h`
  }

  const days = Math.floor(hours / 24)
  return days === 1 ? 'há 1 dia' : `há ${days} dias`
}

export function formatDateTime(date: string | null) {
  if (!date) {
    return '—'
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export const statusLabels: Record<string, string> = {
  open: 'Aberto',
  triage: 'Triagem',
  in_progress: 'Em andamento',
  resolved: 'Resolvido',
  closed: 'Fechado',
}

export const priorityLabels: Record<string, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  critical: 'Crítica',
}

export const categoryLabels: Record<string, string> = {
  Access: 'Acesso',
  Hardware: 'Hardware',
  Software: 'Software',
  Network: 'Rede',
  Security: 'Segurança',
  Other: 'Outro',
}

export const activityLabels: Record<string, string> = {
  comment: 'Comentário',
  diagnosis: 'Diagnóstico',
  action: 'Ação',
}

export const resolutionLabels: Record<string, string> = {
  fixed: 'Corrigido',
  workaround: 'Solução alternativa',
  no_issue: 'Sem problema identificado',
  duplicate: 'Duplicado',
  cancelled: 'Cancelado',
}
