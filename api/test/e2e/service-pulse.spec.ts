import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { database } from '@/database'

const ticketBody = {
  titulo: 'Falha no acesso ao sistema',
  descricao: 'O usuário não consegue acessar o sistema interno da empresa.',
  categoria: 'Access',
  prioridade: 'high',
  status: 'open',
  solicitante: 'Gabriel Santana',
}

const activityBody = {
  tipo: 'comment',
  descricao: 'O usuário confirmou novos detalhes sobre o problema.',
  autor: 'Gabriel Santana',
  tempoGastoMinutos: 10,
}

describe('ServicePulse controllers (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  beforeEach(async () => {
    await database('ticket_activities').delete()
    await database('tickets').delete()
  })

  afterAll(async () => {
    await app.close()
    await database.destroy()
  })

  describe('Tickets', () => {
    it('should be able to create, get, list and update a ticket', async () => {
      const createResponse = await request(app.server).post('/tickets').send(ticketBody)

      expect(createResponse.statusCode).toEqual(201)
      expect(createResponse.body.ticket).toEqual(
        expect.objectContaining({
          idticket: expect.any(String),
          titulo: ticketBody.titulo,
          status: 'open',
        }),
      )

      const { idticket } = createResponse.body.ticket

      const detailsResponse = await request(app.server).get(`/tickets/${idticket}`)

      expect(detailsResponse.statusCode).toEqual(200)
      expect(detailsResponse.body.ticket.idticket).toEqual(idticket)

      const listResponse = await request(app.server).get('/tickets').query({
        q: 'SISTEMA',
        status: 'open',
        _page: 1,
        _limit: 10,
      })

      expect(listResponse.statusCode).toEqual(200)
      expect(listResponse.body).toEqual({
        items: [
          expect.objectContaining({
            idticket,
            activitiesCount: 0,
          }),
        ],
        page: 1,
        pageSize: 10,
        total: 1,
      })

      const updateResponse = await request(app.server)
        .put(`/tickets/${idticket}`)
        .send({
          ...ticketBody,
          status: 'in_progress',
          responsavel: 'Analista de suporte',
        })

      expect(updateResponse.statusCode).toEqual(200)
      expect(updateResponse.body.ticket).toEqual(
        expect.objectContaining({
          idticket,
          status: 'in_progress',
          responsavel: 'Analista de suporte',
        }),
      )

      const requesterSearchResponse = await request(app.server).get('/tickets').query({
        q: 'GABRIEL',
      })

      expect(requesterSearchResponse.body.total).toEqual(1)

      const responsibleSearchResponse = await request(app.server).get('/tickets').query({
        q: 'ANALISTA',
      })

      expect(responsibleSearchResponse.body.total).toEqual(1)
    })

    it('should return validation and not found errors', async () => {
      const validationResponse = await request(app.server)
        .post('/tickets')
        .send({
          ...ticketBody,
          titulo: 'Erro',
        })

      expect(validationResponse.statusCode).toEqual(400)
      expect(validationResponse.body).toEqual(
        expect.objectContaining({
          message: 'Validation error.',
          issues: expect.any(Array),
        }),
      )

      const notFoundResponse = await request(app.server).get(
        '/tickets/00000000-0000-4000-8000-000000000000',
      )

      expect(notFoundResponse.statusCode).toEqual(404)
      expect(notFoundResponse.body.message).toEqual('Ticket not found!')
    })

    it('should be able to delete a ticket', async () => {
      const createResponse = await request(app.server).post('/tickets').send(ticketBody)
      const { idticket } = createResponse.body.ticket

      const deleteResponse = await request(app.server).delete(`/tickets/${idticket}`)

      expect(deleteResponse.statusCode).toEqual(204)

      const detailsResponse = await request(app.server).get(`/tickets/${idticket}`)

      expect(detailsResponse.statusCode).toEqual(404)
    })

    it('should generate resolution dates when creating resolved and closed tickets', async () => {
      const resolvedResponse = await request(app.server)
        .post('/tickets')
        .send({
          ...ticketBody,
          status: 'resolved',
          responsavel: 'Analista de suporte',
          tipoResolucao: 'fixed',
          resumoResolucao: 'O acesso ao sistema foi restabelecido.',
        })

      expect(resolvedResponse.statusCode).toEqual(201)
      expect(resolvedResponse.body.ticket.resolvedAt).toEqual(expect.any(String))
      expect(resolvedResponse.body.ticket.closedAt).toBeNull()

      const closedResponse = await request(app.server)
        .post('/tickets')
        .send({
          ...ticketBody,
          status: 'closed',
          responsavel: 'Analista de suporte',
          tipoResolucao: 'fixed',
          resumoResolucao: 'O acesso ao sistema foi restabelecido.',
        })

      expect(closedResponse.statusCode).toEqual(201)
      expect(closedResponse.body.ticket.resolvedAt).toEqual(expect.any(String))
      expect(closedResponse.body.ticket.closedAt).toEqual(closedResponse.body.ticket.resolvedAt)
    })

    it('should generate resolution dates when updating ticket status', async () => {
      const resolvedTicketResponse = await request(app.server).post('/tickets').send(ticketBody)
      const resolvedTicketId = resolvedTicketResponse.body.ticket.idticket

      const resolvedResponse = await request(app.server)
        .put(`/tickets/${resolvedTicketId}`)
        .send({
          ...ticketBody,
          status: 'resolved',
          responsavel: 'Analista de suporte',
          tipoResolucao: 'fixed',
          resumoResolucao: 'O acesso ao sistema foi restabelecido.',
        })

      expect(resolvedResponse.statusCode).toEqual(200)
      expect(resolvedResponse.body.ticket.resolvedAt).toEqual(expect.any(String))
      expect(resolvedResponse.body.ticket.closedAt).toBeNull()

      const closedTicketResponse = await request(app.server).post('/tickets').send(ticketBody)
      const closedTicketId = closedTicketResponse.body.ticket.idticket

      const closedResponse = await request(app.server)
        .put(`/tickets/${closedTicketId}`)
        .send({
          ...ticketBody,
          status: 'closed',
          responsavel: 'Analista de suporte',
          tipoResolucao: 'fixed',
          resumoResolucao: 'O acesso ao sistema foi restabelecido.',
        })

      expect(closedResponse.statusCode).toEqual(200)
      expect(closedResponse.body.ticket.resolvedAt).toEqual(expect.any(String))
      expect(closedResponse.body.ticket.closedAt).toEqual(closedResponse.body.ticket.resolvedAt)
    })
  })

  describe('Ticket activities', () => {
    it('should be able to create, list, get and update a ticket activity', async () => {
      const ticketResponse = await request(app.server).post('/tickets').send(ticketBody)
      const { idticket } = ticketResponse.body.ticket

      const createResponse = await request(app.server)
        .post(`/tickets/${idticket}/activities`)
        .send(activityBody)

      expect(createResponse.statusCode).toEqual(201)
      expect(createResponse.body.ticketActivity).toEqual(
        expect.objectContaining({
          idactivity: expect.any(String),
          idticket,
          tipo: 'comment',
        }),
      )

      const { idactivity } = createResponse.body.ticketActivity

      const listResponse = await request(app.server)
        .get(`/tickets/${idticket}/activities`)
        .query({ tipo: 'comment', autor: 'Gabriel Santana', _page: 1, _limit: 10 })

      expect(listResponse.statusCode).toEqual(200)
      expect(listResponse.body).toEqual({
        items: [expect.objectContaining({ idactivity, idticket })],
        page: 1,
        pageSize: 10,
        total: 1,
      })

      const ticketsResponse = await request(app.server).get('/tickets')

      expect(ticketsResponse.body.items[0].activitiesCount).toEqual(1)

      const detailsResponse = await request(app.server).get(`/activities/${idactivity}`)

      expect(detailsResponse.statusCode).toEqual(200)
      expect(detailsResponse.body.ticketActivity.idactivity).toEqual(idactivity)

      const updateResponse = await request(app.server).put(`/activities/${idactivity}`).send({
        tipo: 'action',
        descricao: 'As permissões de acesso foram corrigidas e verificadas.',
        autor: 'Analista de suporte',
        tempoGastoMinutos: 25,
      })

      expect(updateResponse.statusCode).toEqual(200)
      expect(updateResponse.body.ticketActivity).toEqual(
        expect.objectContaining({
          idactivity,
          tipo: 'action',
          tempoGastoMinutos: 25,
        }),
      )
    })

    it('should not be able to create an activity for a nonexistent ticket', async () => {
      const response = await request(app.server)
        .post('/tickets/00000000-0000-4000-8000-000000000000/activities')
        .send(activityBody)

      expect(response.statusCode).toEqual(404)
      expect(response.body.message).toEqual('Ticket not found!')
    })

    it('should be able to delete a ticket activity', async () => {
      const ticketResponse = await request(app.server).post('/tickets').send(ticketBody)
      const { idticket } = ticketResponse.body.ticket

      const activityResponse = await request(app.server)
        .post(`/tickets/${idticket}/activities`)
        .send(activityBody)

      const { idactivity } = activityResponse.body.ticketActivity

      const deleteResponse = await request(app.server).delete(`/activities/${idactivity}`)

      expect(deleteResponse.statusCode).toEqual(204)

      const detailsResponse = await request(app.server).get(`/activities/${idactivity}`)

      expect(detailsResponse.statusCode).toEqual(404)
    })

    it('should delete ticket activities when the ticket is deleted', async () => {
      const ticketResponse = await request(app.server).post('/tickets').send(ticketBody)
      const { idticket } = ticketResponse.body.ticket

      const activityResponse = await request(app.server)
        .post(`/tickets/${idticket}/activities`)
        .send(activityBody)

      const { idactivity } = activityResponse.body.ticketActivity

      const deleteResponse = await request(app.server).delete(`/tickets/${idticket}`)

      expect(deleteResponse.statusCode).toEqual(204)

      const detailsResponse = await request(app.server).get(`/activities/${idactivity}`)

      expect(detailsResponse.statusCode).toEqual(404)
    })
  })
})
