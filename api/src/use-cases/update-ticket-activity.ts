import type { TicketActivity } from '@/models/ticket-activity'
import type { TicketActivitiesRepository } from '@/repositories/ticket-activities-repository'
import { TicketActivityNotFoundError } from '@/use-cases/errors/ticket-activity-not-found-error'

interface UpdateTicketActivityUseCaseRequest {
  idactivity: string
  tipo: string
  descricao: string
  autor: string
  tempoGastoMinutos?: number | null
}

interface UpdateTicketActivityUseCaseResponse {
  ticketActivity: TicketActivity
}

export class UpdateTicketActivityUseCase {
  constructor(private ticketActivitiesRepository: TicketActivitiesRepository) {}

  async execute({
    idactivity,
    tipo,
    descricao,
    autor,
    tempoGastoMinutos,
  }: UpdateTicketActivityUseCaseRequest): Promise<UpdateTicketActivityUseCaseResponse> {
    const activityExists = await this.ticketActivitiesRepository.findById(idactivity)

    if (!activityExists) {
      throw new TicketActivityNotFoundError()
    }

    const ticketActivity = await this.ticketActivitiesRepository.update(idactivity, {
      tipo,
      descricao,
      autor,
      tempoGastoMinutos,
    })

    return { ticketActivity }
  }
}
