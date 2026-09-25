import { type ChangeEvent, type SubmitEvent, useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router'
import Button from '../components/button'
import { getButtonClassName } from '../components/button-styles'
import Icon from '../components/icon'
import { EmptyState, ErrorState, TicketListSkeleton } from '../components/list-states'
import PageHeader from '../components/page-header'
import TicketCard from '../components/ticket-card'
import { api } from '../helpers/api'
import type { Ticket, TicketsResponse } from '../models/ticket'

export default function PageTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // Enquanto digita, search input muda -> s / si / sis / sistema
  const [searchInput, setSearchInput] = useState('')
  // Ao clicar para buscar, q recebe searchInput, evitando uma req a cada letra
  // q -> Representa o texto que já foi confirmado para ser enviado à API
  const [q, setQ] = useState('')

  // Estados que representam as opções para filtrar
  const [status, setStatus] = useState('')
  const [category, setCategory] = useState('')
  const [priority, setPriority] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 10

  const totalPages = Math.ceil(total / pageSize)

  const loadTickets = useCallback(async () => {
    try {
      setIsLoading(true)
      setError('')

      const queryParams = new URLSearchParams({
        _page: String(page),
        _limit: String(pageSize),
      })

      if (q) {
        queryParams.set('q', q)
      }
      if (status) {
        queryParams.set('status', status)
      }
      if (category) {
        queryParams.set('categoria', category)
      }
      if (priority) {
        queryParams.set('prioridade', priority)
      }

      const response: TicketsResponse = await api(`/tickets?${queryParams.toString()}`)

      setTickets(response.items)
      setTotal(response.total)
    } catch (requestError) {
      if (requestError instanceof Error) {
        setError(requestError.message)
      } else {
        setError('Não foi possível carregar os chamados!')
      }
    } finally {
      setIsLoading(false)
    }
  }, [category, page, priority, q, status])

  useEffect(() => {
    loadTickets()
  }, [loadTickets])

  function handleSearchTickets() {
    // Copia o texto digitado para o estado que será usado pela API
    setPage(1)
    setQ(searchInput.trim())
  }

  function handleFilterTickets(event: ChangeEvent<HTMLSelectElement>) {
    const { name, value } = event.target

    if (name === 'status') {
      setPage(1)
      setStatus(value)
    }
    if (name === 'categoria') {
      setPage(1)
      setCategory(value)
    }
    if (name === 'prioridade') {
      setPage(1)
      setPriority(value)
    }
  }

  function handleRetryTickets() {
    loadTickets()
  }

  function handleSearchTicketsSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    handleSearchTickets()
  }

  function handleSearchInputChange(event: ChangeEvent<HTMLInputElement>) {
    // Pega o texto completo do input após a digitação do usuário, após isso, salva o txt no estado
    setSearchInput(event.target.value)
  }

  function handlePreviousPage() {
    setPage((currentPage) => currentPage - 1)
  }

  function handleNextPage() {
    setPage((currentPage) => currentPage + 1)
  }

  return (
    <div className="space-y-8">
      <PageHeader
        description="Acompanhe solicitações, prioridades e movimentações da operação em um só lugar."
        eyebrow="Visão geral"
        title="Chamados"
      />

      <form
        className="rounded-2xl border border-border bg-white p-4 shadow-card sm:p-5"
        onSubmit={handleSearchTicketsSubmit}
      >
        <div className="grid gap-3 lg:grid-cols-[minmax(280px,1.6fr)_repeat(3,minmax(150px,0.7fr))_auto]">
          <label className="relative block">
            <span className="sr-only">Buscar chamados</span>
            <Icon
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-soft"
              name="search"
              size={19}
            />
            <input
              className="h-11 w-full rounded-xl border border-border bg-surface-subtle pl-11 pr-4 text-sm text-text outline-none transition placeholder:text-text-soft focus:border-primary focus:bg-white focus:ring-3 focus:ring-primary-soft"
              name="q"
              placeholder="Buscar por título, solicitante..."
              type="search"
              value={searchInput}
              onChange={handleSearchInputChange}
            />
          </label>

          <label>
            <span className="sr-only">Filtrar por status</span>
            <select
              className="h-11 w-full rounded-xl border border-border bg-white px-3.5 text-sm text-text outline-none transition focus:border-primary focus:ring-3 focus:ring-primary-soft"
              value={status}
              name="status"
              onChange={handleFilterTickets}
            >
              <option value="">Todos os status</option>
              <option value="open">Aberto</option>
              <option value="triage">Em triagem</option>
              <option value="in_progress">Em andamento</option>
              <option value="resolved">Resolvido</option>
              <option value="closed">Fechado</option>
            </select>
          </label>

          <label>
            <span className="sr-only">Filtrar por categoria</span>
            <select
              className="h-11 w-full rounded-xl border border-border bg-white px-3.5 text-sm text-text outline-none transition focus:border-primary focus:ring-3 focus:ring-primary-soft"
              value={category}
              name="categoria"
              onChange={handleFilterTickets}
            >
              <option value="">Todas as categorias</option>
              <option value="Access">Acesso</option>
              <option value="Hardware">Hardware</option>
              <option value="Software">Software</option>
              <option value="Network">Rede</option>
              <option value="Security">Segurança</option>
              <option value="Other">Outro</option>
            </select>
          </label>

          <label>
            <span className="sr-only">Filtrar por prioridade</span>
            <select
              className="h-11 w-full rounded-xl border border-border bg-white px-3.5 text-sm text-text outline-none transition focus:border-primary focus:ring-3 focus:ring-primary-soft"
              value={priority}
              name="prioridade"
              onChange={handleFilterTickets}
            >
              <option value="">Todas as prioridades</option>
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
              <option value="critical">Crítica</option>
            </select>
          </label>

          <Button aria-label="Buscar" icon="search" size="icon" type="submit" />
        </div>
      </form>

      <section aria-labelledby="tickets-result-title" className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-text" id="tickets-result-title">
              {total} chamados encontrados
            </h2>
            <p className="mt-1 text-xs text-text-muted">Ordenados pela atualização mais recente</p>
          </div>
        </div>
        {isLoading && <TicketListSkeleton />}
        {!isLoading && !error && tickets.length === 0 && <EmptyState />}
        {!isLoading && error && <ErrorState message={error} onRetry={handleRetryTickets} />}
        {!isLoading && !error && tickets.length > 0 && (
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <TicketCard key={ticket.idticket} ticket={ticket} />
            ))}

            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-border pt-4">
                <Button
                  disabled={page === 1}
                  onClick={handlePreviousPage}
                  type="button"
                  variant="secondary"
                >
                  Anterior
                </Button>

                <span className="text-sm text-text-muted">
                  Página {page} de {totalPages}
                </span>

                <Button
                  disabled={page === totalPages}
                  onClick={handleNextPage}
                  type="button"
                  variant="secondary"
                >
                  Próxima
                </Button>
              </div>
            )}
          </div>
        )}
      </section>

      <Link
        className={getButtonClassName(
          'primary',
          'lg',
          'fixed bottom-5 right-5 z-30 rounded-2xl px-5 shadow-floating sm:bottom-8 sm:right-8',
        )}
        to="/tickets/new"
      >
        <Icon name="plus" size={19} />
        Novo
      </Link>
    </div>
  )
}
