import { useCallback, useEffect, useRef, useState, type SubmitEvent } from 'react'
import { useNavigate, useParams } from 'react-router'
import Button from '../components/button'
import { Field, Input, Select, Textarea } from '../components/form-field'
import { ActivityListSkeleton, ErrorState } from '../components/list-states'
import PageHeader from '../components/page-header'
import { api } from '../helpers/api'
import { formatTicketCode } from '../helpers/formatters'
import type { Ticket, TicketActivity } from '../models/ticket'

export default function PageActivityForm() {
  const { idticket, idactivity } = useParams()
  const navigate = useNavigate()
  const activityFormRef = useRef<HTMLFormElement>(null)
  const [ticket, setTicket] = useState<Ticket>()
  const [activity, setActivity] = useState<TicketActivity>()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [saveError, setSaveError] = useState('')
  const isEditing = Boolean(idactivity)
  const returnPath = ticket ? `/tickets/${ticket.idticket}` : '/'

  const loadActivityForm = useCallback(async () => {
    try {
      setIsLoading(true)
      setError('')
      setSaveError('')

      if (!idticket) {
        throw new Error('Chamado não encontrado.')
      }

      const ticketResponse: { ticket: Ticket } = await api(`/tickets/${idticket}`)

      if (idactivity) {
        const activityResponse: { ticketActivity: TicketActivity } = await api(
          `/activities/${idactivity}`,
        )

        if (activityResponse.ticketActivity.idticket !== ticketResponse.ticket.idticket) {
          throw new Error('Esta atividade não pertence ao chamado informado.')
        }

        setActivity(activityResponse.ticketActivity)
      } else {
        setActivity(undefined)
      }

      setTicket(ticketResponse.ticket)
    } catch (requestError) {
      if (requestError instanceof Error) {
        setError(requestError.message)
      } else {
        setError('Não foi possível carregar os dados da atividade.')
      }
    } finally {
      setIsLoading(false)
    }
  }, [idticket, idactivity])

  useEffect(() => {
    loadActivityForm()
  }, [loadActivityForm])

  async function handleSaveActivity(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!activityFormRef.current || !ticket || isSaving || (isEditing && !activity)) {
      return
    }

    setSaveError('')
    const activityForm = new FormData(activityFormRef.current)
    const activityMinutes = String(activityForm.get('tempoGastoMinutos') ?? '')
    const activityPayload = {
      tipo: String(activityForm.get('tipo') ?? ''),
      descricao: String(activityForm.get('descricao') ?? ''),
      autor: String(activityForm.get('autor') ?? ''),
      tempoGastoMinutos: activityMinutes === '' ? undefined : Number(activityMinutes),
    }

    if (!['comment', 'diagnosis', 'action'].includes(activityPayload.tipo)) {
      setSaveError('Tipo: opção inválida. Selecione comentário, diagnóstico ou ação.')
      return
    }
    if (activityPayload.descricao.length < 10) {
      setSaveError('Descrição: muito pequena; esperado texto com pelo menos 10 caracteres.')
      return
    }
    if (activityPayload.autor.length < 2) {
      setSaveError('Autor: muito pequeno; esperado texto com pelo menos 2 caracteres.')
      return
    }
    if (activityMinutes !== '' && !Number.isInteger(activityPayload.tempoGastoMinutos)) {
      setSaveError('Tempo gasto: tipo inválido; esperado número inteiro.')
      return
    }
    if (activityPayload.tempoGastoMinutos !== undefined && activityPayload.tempoGastoMinutos < 0) {
      setSaveError('Tempo gasto: muito pequeno; esperado número maior ou igual a 0.')
      return
    }
    if (
      activityPayload.tempoGastoMinutos !== undefined &&
      activityPayload.tempoGastoMinutos > 1440
    ) {
      setSaveError('Tempo gasto: muito grande; esperado número menor ou igual a 1440.')
      return
    }

    try {
      setIsSaving(true)
      setSaveError('')

      if (isEditing) {
        await api(`/activities/${idactivity}`, {
          method: 'PUT',
          body: JSON.stringify(activityPayload),
        })
      } else {
        await api(`/tickets/${ticket.idticket}/activities`, {
          method: 'POST',
          body: JSON.stringify(activityPayload),
        })
      }

      navigate(returnPath)
    } catch (requestError) {
      if (requestError instanceof Error) {
        setSaveError(requestError.message)
      } else {
        setSaveError('Não foi possível salvar a atividade.')
      }
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        backTo={isSaving ? undefined : returnPath}
        description="Registre informações objetivas para manter o histórico do atendimento claro."
        eyebrow={ticket ? formatTicketCode(ticket.idticket) : undefined}
        title={isEditing ? 'Editar atividade' : 'Nova atividade'}
      />

      {isLoading ? (
        <ActivityListSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={loadActivityForm} />
      ) : (
        <form
          key={idactivity ?? idticket}
          noValidate
          onSubmit={handleSaveActivity}
          ref={activityFormRef}
        >
          <fieldset className="space-y-6" disabled={isSaving}>
            <section className="rounded-2xl border border-border bg-white p-5 shadow-card sm:p-6">
              <div className="grid gap-5 md:grid-cols-2">
                <Field htmlFor="tipo" label="Tipo">
                  <Select defaultValue={activity?.tipo ?? 'comment'} id="tipo" name="tipo" required>
                    <option value="comment">Comentário</option>
                    <option value="diagnosis">Diagnóstico</option>
                    <option value="action">Ação</option>
                  </Select>
                </Field>

                <Field htmlFor="autor" label="Autor">
                  <Input
                    defaultValue={activity?.autor ?? ''}
                    id="autor"
                    minLength={2}
                    name="autor"
                    placeholder="Nome de quem registrou a atividade"
                    required
                  />
                </Field>

                <Field className="md:col-span-2" htmlFor="descricao" label="Descrição">
                  <Textarea
                    defaultValue={activity?.descricao ?? ''}
                    id="descricao"
                    minLength={10}
                    name="descricao"
                    placeholder="Descreva o comentário, diagnóstico ou ação realizada"
                    required
                    rows={6}
                  />
                </Field>

                <Field hint="Opcional" htmlFor="tempoGastoMinutos" label="Tempo gasto em minutos">
                  <Input
                    defaultValue={activity?.tempoGastoMinutos ?? ''}
                    id="tempoGastoMinutos"
                    max="1440"
                    min="0"
                    name="tempoGastoMinutos"
                    placeholder="Ex.: 30"
                    step="1"
                    type="number"
                  />
                </Field>
              </div>
            </section>

            {saveError && (
              <p
                className="rounded-xl border border-danger/20 bg-danger-soft p-4 text-sm text-danger"
                role="alert"
              >
                {saveError}
              </p>
            )}

            <div className="flex flex-col-reverse gap-2 border-t border-border pt-6 sm:flex-row sm:justify-end">
              <Button
                disabled={isSaving}
                onClick={() => navigate(returnPath)}
                type="button"
                variant="secondary"
              >
                Cancelar
              </Button>
              <Button disabled={isSaving} icon="check" type="submit">
                {isSaving ? 'Salvando atividade...' : 'Salvar atividade'}
              </Button>
            </div>
          </fieldset>
        </form>
      )}
    </div>
  )
}
