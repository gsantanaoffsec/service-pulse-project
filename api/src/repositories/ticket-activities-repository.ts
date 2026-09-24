import type { TicketActivity } from '@/models/ticket-activity'

// "Contrato" de criação mostra o que o usuário fornece

export interface CreateTicketActivityData {
  idticket: string
  tipo: string
  descricao: string
  autor: string
  tempoGastoMinutos?: number | null
}

export interface UpdateTicketActivityData {
  tipo: string
  descricao: string
  autor: string
  tempoGastoMinutos?: number | null
}

export interface FindManyTicketActivitiesParams {
  idticket: string
  tipo?: string
  autor?: string
  page: number
  limit: number
}

export interface FindManyTicketActivitiesResult {
  items: TicketActivity[]
  total: number
}

export interface TicketActivitiesRepository {
  create(data: CreateTicketActivityData): Promise<TicketActivity>
  findById(idactivity: string): Promise<TicketActivity | null>
  findManyByTicketId(
    params: FindManyTicketActivitiesParams,
  ): Promise<FindManyTicketActivitiesResult>
  update(idactivity: string, data: UpdateTicketActivityData): Promise<TicketActivity>
  delete(idactivity: string): Promise<void>
}
