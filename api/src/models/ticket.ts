// O que já existe no domínio depois de criado

export interface Ticket {
  idticket: string
  titulo: string
  descricao: string
  categoria: string
  prioridade: string
  status: string
  solicitante: string
  responsavel: string | null
  tipoResolucao: string | null
  resumoResolucao: string | null
  resolvedAt: string | null
  closedAt: string | null
  createdAt: string
  updatedAt: string
}

// Representação do ticket devolvido pela listagem com a contagem adicional

export interface TicketWithActivitiesCount extends Ticket {
  activitiesCount: number
}
