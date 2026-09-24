import { randomUUID } from 'node:crypto'
import { database } from '@/database'
import type { TicketActivity } from '@/models/ticket-activity'
import type { TicketActivitiesRepository } from '@/repositories/ticket-activities-repository'
import type {
  CreateTicketActivityData,
  FindManyTicketActivitiesParams,
  UpdateTicketActivityData,
} from '@/repositories/ticket-activities-repository'

export class KnexTicketActivitiesRepository implements TicketActivitiesRepository {
  async create(data: CreateTicketActivityData) {
    const now = new Date().toISOString()

    const ticketActivity: TicketActivity = {
      idactivity: randomUUID(),
      idticket: data.idticket,
      tipo: data.tipo,
      descricao: data.descricao,
      autor: data.autor,
      tempoGastoMinutos: data.tempoGastoMinutos ?? null,
      createdAt: now,
      updatedAt: now,
    }

    await database('ticket_activities').insert(ticketActivity)

    return ticketActivity
  }

  async findById(idactivity: string) {
    const ticket = await database('ticket_activities').where('idactivity', idactivity).first()

    if (!ticket) {
      return null
    }

    return ticket
  }

  async findManyByTicketId(params: FindManyTicketActivitiesParams) {
    const { idticket, tipo, autor, page, limit } = params

    const query = database('ticket_activities').where('idticket', idticket)

    if (tipo) {
      query.where('tipo', tipo)
    }
    if (autor) {
      query.where('autor', autor)
    }

    const totalResult = await query.clone().count({ total: '*' }).first()

    const items = await query
      .orderBy('createdAt', 'asc')
      .limit(limit)
      .offset((page - 1) * limit)

    const total = Number(totalResult?.total ?? 0)

    return { items, total }
  }

  async update(idactivity: string, data: UpdateTicketActivityData) {
    // Desestruturação pegando o primeiro elemento
    const [ticketActivity] = await database('ticket_activities')
      .where('idactivity', idactivity)
      .update({
        tipo: data.tipo,
        descricao: data.descricao,
        autor: data.autor,
        tempoGastoMinutos: data.tempoGastoMinutos ?? null,
        updatedAt: new Date().toISOString(),
      })
      .returning('*')

    return ticketActivity
  }

  async delete(idactivity: string) {
    await database('ticket_activities').where('idactivity', idactivity).delete()
  }
}
