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
  activitiesCount?: number
}

export interface TicketActivity {
  idactivity: string
  idticket: string
  tipo: string
  descricao: string
  autor: string
  tempoGastoMinutos: number | null
  createdAt: string
  updatedAt: string
}

export interface TicketsResponse {
  items: Ticket[]
  page: number
  pageSize: number
  total: number
}

export interface TicketActivitiesResponse {
  items: TicketActivity[]
  page: number
  pageSize: number
  total: number
}
