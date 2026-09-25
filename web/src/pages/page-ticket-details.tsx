import { useCallback, useEffect, useState, type SubmitEvent } from 'react'
import { Link, useParams } from 'react-router'
import ActivityItem from '../components/activity-item'
import Button from '../components/button'
import { getButtonClassName } from '../components/button-styles'
import ConfirmModal from '../components/confirm-modal'
import { Input, Select } from '../components/form-field'
import Icon from '../components/icon'
import {
  ActivityListSkeleton,
  EmptyActivitiesState,
  ErrorState,
  TicketListSkeleton,
} from '../components/list-states'
import PageHeader from '../components/page-header'
import PriorityBadge from '../components/priority-badge'
import StatusBadge from '../components/status-badge'
import { api } from '../helpers/api'
import {
  formatCategory,
  formatDate,
  formatResolutionType,
  formatTicketCode,
} from '../helpers/formatters'
import type { Ticket, TicketActivitiesResponse, TicketActivity } from '../models/ticket'

export default function PageTicketDetails() {
  const { idticket } = useParams()
  const [ticket, setTicket] = useState<Ticket>()
  const [ticketActivities, setTicketActivities] = useState<TicketActivity[]>([])
  const [selectedActivity, setSelectedActivity] = useState<TicketActivity>()
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingActivities, setIsLoadingActivities] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')
  const [activitiesError, setActivitiesError] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [activityType, setActivityType] = useState('')
  const [authorInput, setAuthorInput] = useState('')
  const [author, setAuthor] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 10
  const totalPages = Math.ceil(total / pageSize)

  const loadTicket = useCallback(async () => {
    try {
      setIsLoading(true)
      setError('')
      setTicket(undefined)

      if (!idticket) {
        throw new Error('Chamado não encontrado.')
      }

      const ticketResponse: { ticket: Ticket } = await api(`/tickets/${idticket}`)
      setTicket(ticketResponse.ticket)
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Não foi possível carregar o chamado.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [idticket])

  const loadActivities = useCallback(async () => {
    if (!idticket) {
      return
    }

    try {
      setIsLoadingActivities(true)
      setActivitiesError('')
      const queryParams = new URLSearchParams({ _page: String(page), _limit: String(pageSize) })

      if (activityType) {
        queryParams.set('tipo', activityType)
      }
      if (author) {
        queryParams.set('autor', author)
      }

      const activitiesResponse: TicketActivitiesResponse = await api(
        `/tickets/${idticket}/activities?${queryParams.toString()}`,
      )
      setTicketActivities(activitiesResponse.items)
      setTotal(activitiesResponse.total)
    } catch (requestError) {
      setActivitiesError(
        requestError instanceof Error
          ? requestError.message
          : 'Não foi possível carregar as atividades.',
      )
    } finally {
      setIsLoadingActivities(false)
    }
  }, [idticket, page, activityType, author])

  useEffect(() => {
    loadTicket()
  }, [loadTicket])

  useEffect(() => {
    loadActivities()
  }, [loadActivities])

  function handleFilterActivities(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setPage(1)
    setAuthor(authorInput)
  }

  function handleSelectActivity(activity: TicketActivity) {
    setDeleteError('')
    setSelectedActivity(activity)
  }

  async function handleDeleteActivity() {
    if (!selectedActivity || isDeleting) {
      return
    }

    try {
      setIsDeleting(true)
      setDeleteError('')
      await api(`/activities/${selectedActivity.idactivity}`, { method: 'DELETE' })
      setSelectedActivity(undefined)

      if (ticketActivities.length === 1 && page > 1) {
        setPage(page - 1)
      } else {
        await loadActivities()
      }
    } catch (requestError) {
      setDeleteError(
        requestError instanceof Error
          ? requestError.message
          : 'Não foi possível excluir a atividade.',
      )
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return <TicketListSkeleton />
  }
  if (error || !ticket) {
    return (
      <div className="space-y-8">
        <PageHeader backTo="/" title="Detalhes do chamado" />
        <ErrorState message={error || 'Chamado não encontrado.'} onRetry={loadTicket} />
      </div>
    )
  }

  const ticketDetails = [
    { label: 'Código', value: formatTicketCode(ticket.idticket) },
    { label: 'Solicitante', value: ticket.solicitante },
    { label: 'Responsável', value: ticket.responsavel ?? 'Ainda não atribuído' },
    { label: 'Categoria', value: formatCategory(ticket.categoria) },
  ]

  return (
    <div className="space-y-8">
      <PageHeader
        actions={
          <Link
            className={getButtonClassName('secondary', 'md')}
            to={`/tickets/${ticket.idticket}/edit`}
          >
            <Icon name="edit" size={17} />
            Editar
          </Link>
        }
        backTo="/"
        eyebrow={formatTicketCode(ticket.idticket)}
        title={ticket.titulo}
      />

      <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-card">
        <div className="flex flex-wrap items-center gap-5 border-b border-border bg-surface-subtle/70 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-soft">
              Status
            </span>
            <StatusBadge status={ticket.status} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-soft">
              Prioridade
            </span>
            <PriorityBadge priority={ticket.prioridade} />
          </div>
        </div>

        <div className="grid gap-x-8 gap-y-6 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
          {ticketDetails.map((ticketDetail) => (
            <div key={ticketDetail.label}>
              <dt className="text-xs font-semibold uppercase tracking-wider text-text-soft">
                {ticketDetail.label}
              </dt>
              <dd className="mt-2 text-sm font-medium text-text">{ticketDetail.value}</dd>
            </div>
          ))}
        </div>

        <div className="border-t border-border px-5 py-6 sm:px-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-soft">Título</h2>
          <p className="mt-3 text-base font-semibold text-text">{ticket.titulo}</p>
        </div>

        <div className="border-t border-border px-5 py-6 sm:px-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-soft">
            Descrição
          </h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-text-muted">{ticket.descricao}</p>
        </div>

        {(ticket.tipoResolucao || ticket.resolvedAt || ticket.closedAt) && (
          <div className="space-y-3 border-t border-border px-5 py-6 sm:px-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-text-soft">
              Resolução
            </h2>
            {ticket.tipoResolucao && (
              <p className="text-sm text-text">{formatResolutionType(ticket.tipoResolucao)}</p>
            )}
            {ticket.resumoResolucao && (
              <p className="text-sm text-text-muted">{ticket.resumoResolucao}</p>
            )}
            {ticket.resolvedAt && (
              <p className="text-xs text-text-muted">
                Resolvido em {formatDate(ticket.resolvedAt)}
              </p>
            )}
            {ticket.closedAt && (
              <p className="text-xs text-text-muted">Fechado em {formatDate(ticket.closedAt)}</p>
            )}
          </div>
        )}

        <footer className="flex flex-col gap-2 border-t border-border bg-surface-subtle/50 px-5 py-4 text-xs text-text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>Criado em {formatDate(ticket.createdAt)}</span>
          <span>Atualizado em {formatDate(ticket.updatedAt)}</span>
        </footer>
      </section>

      <section
        aria-labelledby="activities-title"
        className="rounded-2xl border border-border bg-white p-5 shadow-card sm:p-6"
      >
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-text" id="activities-title">
              Atividades ({total})
            </h2>
            <p className="mt-1 text-sm text-text-muted">
              Acompanhe todas as movimentações do chamado.
            </p>
          </div>
          <Link
            className={getButtonClassName('primary', 'sm')}
            to={`/tickets/${ticket.idticket}/activities/new`}
          >
            <Icon name="plus" size={17} />
            Nova atividade
          </Link>
        </div>

        <form className="mb-6 flex flex-col gap-3 sm:flex-row" onSubmit={handleFilterActivities}>
          <Select
            aria-label="Filtrar tipo de atividade"
            value={activityType}
            disabled={isLoadingActivities}
            onChange={(event) => {
              setPage(1)
              setActivityType(event.target.value)
            }}
          >
            <option value="">Todos os tipos</option>
            <option value="comment">Comentário</option>
            <option value="diagnosis">Diagnóstico</option>
            <option value="action">Ação</option>
          </Select>
          <Input
            aria-label="Filtrar por autor exato"
            placeholder="Nome exato do autor"
            value={authorInput}
            onChange={(event) => setAuthorInput(event.target.value)}
          />
          <Button disabled={isLoadingActivities} type="submit">
            Filtrar
          </Button>
        </form>

        {isLoadingActivities && <ActivityListSkeleton />}
        {!isLoadingActivities && activitiesError && (
          <ErrorState compact message={activitiesError} onRetry={loadActivities} />
        )}
        {!isLoadingActivities && !activitiesError && ticketActivities.length === 0 && (
          <EmptyActivitiesState />
        )}
        {!isLoadingActivities &&
          !activitiesError &&
          ticketActivities.map((activity) => (
            <ActivityItem
              activity={activity}
              key={activity.idactivity}
              onDelete={handleSelectActivity}
            />
          ))}
        {!isLoadingActivities && !activitiesError && totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-4">
            <Button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              type="button"
              variant="secondary"
            >
              Anterior
            </Button>
            <span className="text-sm text-text-muted">
              Página {page} de {totalPages}
            </span>
            <Button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              type="button"
              variant="secondary"
            >
              Próxima
            </Button>
          </div>
        )}
      </section>

      <ConfirmModal
        description="Esta atividade será removida permanentemente do histórico do chamado."
        onCancel={() => setSelectedActivity(undefined)}
        onConfirm={handleDeleteActivity}
        isDeleting={isDeleting}
        error={deleteError}
        open={Boolean(selectedActivity)}
        title="Excluir atividade?"
      />
    </div>
  )
}
