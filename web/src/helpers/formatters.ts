export function formatTicketCode(idticket: string) {
  return `#${idticket.slice(0, 8).toUpperCase()}`
}

export function formatCategory(category: string) {
  const categoryLabels: Record<string, string> = {
    Access: 'Acesso',
    Hardware: 'Hardware',
    Software: 'Software',
    Network: 'Rede',
    Security: 'Segurança',
    Other: 'Outro',
  }

  return categoryLabels[category] ?? 'Categoria desconhecida'
}

export function formatResolutionType(resolutionType: string) {
  const resolutionLabels: Record<string, string> = {
    fixed: 'Correção definitiva',
    workaround: 'Solução alternativa',
    no_issue: 'Nenhum problema encontrado',
    duplicate: 'Chamado duplicado',
    cancelled: 'Cancelado',
  }

  return resolutionLabels[resolutionType] ?? 'Solução desconhecida'
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function formatTime(date: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
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
