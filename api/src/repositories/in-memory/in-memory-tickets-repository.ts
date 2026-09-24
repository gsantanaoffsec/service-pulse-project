import { randomUUID } from 'node:crypto'
import type { Ticket } from '@/models/ticket'
import type {
  CreateTicketData,
  FindManyTicketsParams,
  TicketsRepository,
  UpdateTicketData,
} from '@/repositories/tickets-repository'

export class InMemoryTicketsRepository implements TicketsRepository {
  public items: Ticket[] = []

  async create(data: CreateTicketData) {
    const now = new Date().toISOString()

    const ticket = {
      idticket: randomUUID(),
      titulo: data.titulo,
      descricao: data.descricao,
      categoria: data.categoria,
      prioridade: data.prioridade,
      status: data.status ?? 'open',
      solicitante: data.solicitante,
      responsavel: data.responsavel ?? null,
      tipoResolucao: data.tipoResolucao ?? null,
      resumoResolucao: data.resumoResolucao ?? null,
      resolvedAt: data.resolvedAt ?? null,
      closedAt: data.closedAt ?? null,
      createdAt: now,
      updatedAt: now,
    }

    this.items.push(ticket)

    return ticket
  }

  async findById(idticket: string) {
    const ticket = this.items.find((ticket) => ticket.idticket === idticket)

    if (!ticket) {
      return null
    }

    return ticket
  }

  async findMany(params: FindManyTicketsParams) {
    const { q, status, categoria, prioridade, page, limit } = params

    const filtered = this.items.filter((ticket) => {
      if (status && ticket.status !== status) {
        return false
      }
      if (categoria && ticket.categoria !== categoria) {
        return false
      }
      if (prioridade && ticket.prioridade !== prioridade) {
        return false
      }

      if (q) {
        const query = q.toLowerCase()
        const matchesTitle = ticket.titulo.toLowerCase().includes(query)
        const matchesDescription = ticket.descricao.toLowerCase().includes(query)
        const matchesRequester = ticket.solicitante.toLowerCase().includes(query)
        const matchesResponsible = ticket.responsavel?.toLowerCase().includes(query) ?? false

        if (!matchesTitle && !matchesDescription && !matchesRequester && !matchesResponsible) {
          return false
        }
      }

      return true
    })

    const total = filtered.length

    const start = (page - 1) * limit
    const end = start + limit
    const items = filtered.slice(start, end).map((ticket) => ({
      ...ticket,
      activitiesCount: 0,
    }))

    return { items, total }
  }

  async update(idticket: string, data: UpdateTicketData) {
    const ticketIndex = this.items.findIndex((ticket) => ticket.idticket === idticket)

    if (ticketIndex === -1) {
      throw new Error('Ticket não encontrado!')
    }

    const updatedTicket = {
      ...this.items[ticketIndex],
      ...data,
      responsavel: data.responsavel ?? null,
      tipoResolucao: data.tipoResolucao ?? null,
      resumoResolucao: data.resumoResolucao ?? null,
      resolvedAt: data.resolvedAt ?? null,
      closedAt: data.closedAt ?? null,
      updatedAt: new Date().toISOString(),
    }

    this.items[ticketIndex] = updatedTicket

    return updatedTicket
  }

  async delete(idticket: string) {
    const ticketExists = this.items.some((ticket) => ticket.idticket === idticket)

    if (!ticketExists) {
      throw new Error('Não foi possível encontrar o ticket solicitado para exclusão!')
    }
    // Atribuição do array novo
    this.items = this.items.filter((ticket) => ticket.idticket !== idticket)
  }
}
