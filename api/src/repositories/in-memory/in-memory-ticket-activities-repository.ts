import { randomUUID } from 'node:crypto'
import { TicketActivity } from '@/models/ticket-activity'
import type {
  CreateTicketActivityData,
  FindManyTicketActivitiesParams,
  TicketActivitiesRepository,
  UpdateTicketActivityData,
} from '@/repositories/ticket-activities-repository'

export class InMemoryTicketsActivitiesRepository implements TicketActivitiesRepository {
  public items: TicketActivity[] = []

  async create(data: CreateTicketActivityData) {
    const now = new Date().toISOString()

    const ticketActivity = {
      idactivity: randomUUID(),
      idticket: data.idticket,
      tipo: data.tipo,
      descricao: data.descricao,
      autor: data.autor,
      tempoGastoMinutos: data.tempoGastoMinutos ?? null,
      createdAt: now,
      updatedAt: now,
    }

    this.items.push(ticketActivity)

    return ticketActivity
  }

  async findById(idactivity: string) {
    const ticketActivity = this.items.find((activity) => activity.idactivity === idactivity)

    if (!ticketActivity) {
      return null
    }

    return ticketActivity
  }

  async findManyByTicketId(params: FindManyTicketActivitiesParams) {
    const { idticket, tipo, autor, page, limit } = params

    const filtered = this.items.filter((activity) => {
      if (activity.idticket !== idticket) {
        return false
      }
      if (tipo && activity.tipo !== tipo) {
        return false
      }
      if (autor && activity.autor !== autor) {
        return false
      }

      return true
    })

    // Contém todos os registros que passaram pelo filtro
    const total = filtered.length

    const items = filtered.slice((page - 1) * limit, page * limit)

    return {
      items,
      total,
    }
  }

  async update(idactivity: string, data: UpdateTicketActivityData) {
    const activityIndex = this.items.findIndex((activity) => activity.idactivity === idactivity)

    if (activityIndex === -1) {
      throw new Error('Atividade não encontrada!')
    }

    const updatedActivity = {
      ...this.items[activityIndex],
      ...data,
      tipo: data.tipo,
      descricao: data.descricao,
      autor: data.autor,
      tempoGastoMinutos: data.tempoGastoMinutos ?? null,
      updatedAt: new Date().toISOString(),
    }

    this.items[activityIndex] = updatedActivity

    return updatedActivity
  }

  async delete(idactivity: string) {
    const activityExists = this.items.some((activity) => activity.idactivity === idactivity)

    if (!activityExists) {
      throw new Error('Não foi possível encontrar a atividade solicitada para exclusão!')
    }

    this.items = this.items.filter((activity) => activity.idactivity !== idactivity)
  }
}
