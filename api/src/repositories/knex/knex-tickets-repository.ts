import { randomUUID } from 'node:crypto'
import { database } from '@/database'
import type { Ticket, TicketWithActivitiesCount } from '@/models/ticket'
import type {
  CreateTicketData,
  FindManyTicketsParams,
  TicketsRepository,
  UpdateTicketData,
} from '@/repositories/tickets-repository'

export class KnexTicketsRepository implements TicketsRepository {
  async findById(idticket: string) {
    const ticket = await database('tickets').where('idticket', idticket).first()

    if (!ticket) {
      return null
    }

    return ticket
  }

  async findMany(params: FindManyTicketsParams) {
    const { q, status, categoria, prioridade, page, limit } = params

    const query = database('tickets')

    if (status) {
      query.where('status', status)
    }
    if (categoria) {
      query.where('categoria', categoria)
    }
    if (prioridade) {
      query.where('prioridade', prioridade)
    }

    if (q) {
      const search = `%${q.toLowerCase()}%`

      query.where((queryBuilder) => {
        queryBuilder
          // Aqui busca o texto no título ou na descrição, ? -> recebe o conteúdo de [search]
          .whereRaw('LOWER(tickets.titulo) LIKE ?', [search])
          .orWhereRaw('LOWER(tickets.descricao) LIKE ?', [search])
          .orWhereRaw('LOWER(tickets.solicitante) LIKE ?', [search])
          .orWhereRaw('LOWER(tickets.responsavel) LIKE ?', [search])
      })
    }

    const totalResult = await query.clone().count({ total: '*' }).first()

    const tickets = (await query
      .leftJoin('ticket_activities', 'tickets.idticket', 'ticket_activities.idticket')
      .select('tickets.*')
      .count({ activitiesCount: 'ticket_activities.idactivity' })
      .groupBy('tickets.idticket')
      .orderBy('tickets.updatedAt', 'desc')
      .limit(limit)
      .offset((page - 1) * limit)) as TicketWithActivitiesCount[]

    const items = tickets.map((ticket) => ({
      ...ticket,
      activitiesCount: Number(ticket.activitiesCount),
    }))

    const total = Number(totalResult?.total ?? 0)

    return { items, total }
  }

  async update(idticket: string, data: UpdateTicketData) {
    const [ticket] = await database('tickets')
      .where('idticket', idticket)
      .update({
        titulo: data.titulo,
        descricao: data.descricao,
        categoria: data.categoria,
        prioridade: data.prioridade,
        status: data.status,
        solicitante: data.solicitante,
        responsavel: data.responsavel ?? null,
        tipoResolucao: data.tipoResolucao ?? null,
        resumoResolucao: data.resumoResolucao ?? null,
        resolvedAt: data.resolvedAt ?? null,
        closedAt: data.closedAt ?? null,
        updatedAt: new Date().toISOString(),
      })
      .returning('*')

    return ticket
  }

  async delete(idticket: string) {
    await database('tickets').where('idticket', idticket).delete()
  }

  async create(data: CreateTicketData) {
    const now = new Date().toISOString()

    const ticket: Ticket = {
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

    await database('tickets').insert(ticket)

    return ticket
  }
}
