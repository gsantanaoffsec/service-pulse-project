import type { Ticket, TicketWithActivitiesCount } from '@/models/ticket'

export interface FindManyTicketsParams {
  q?: string
  status?: string
  categoria?: string
  prioridade?: string
  page: number
  limit: number
}

export interface FindManyTicketsResult {
  items: TicketWithActivitiesCount[]
  total: number
}

export interface CreateTicketData {
  titulo: string
  descricao: string
  categoria: string
  prioridade: string
  status?: string
  solicitante: string
  responsavel?: string | null
  tipoResolucao?: string | null
  resumoResolucao?: string | null
  resolvedAt?: string | null
  closedAt?: string | null
}

export interface UpdateTicketData {
  titulo: string
  descricao: string
  categoria: string
  prioridade: string
  status: string
  solicitante: string
  responsavel?: string | null
  tipoResolucao?: string | null
  resumoResolucao?: string | null
  resolvedAt?: string | null
  closedAt?: string | null
}

export interface TicketsRepository {
  create(data: CreateTicketData): Promise<Ticket>
  findById(idticket: string): Promise<Ticket | null>
  findMany(params: FindManyTicketsParams): Promise<FindManyTicketsResult>
  update(idticket: string, data: UpdateTicketData): Promise<Ticket>
  delete(idticket: string): Promise<void>
}
