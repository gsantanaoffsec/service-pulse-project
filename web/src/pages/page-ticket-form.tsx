import { useCallback, useEffect, useRef, useState, type SubmitEvent } from 'react'
import { useNavigate, useParams } from 'react-router'
import Button from '../components/button'
import ConfirmModal from '../components/confirm-modal'
import { Field, Input, Select, Textarea } from '../components/form-field'
import { ErrorState, TicketListSkeleton } from '../components/list-states'
import PageHeader from '../components/page-header'
import { api } from '../helpers/api'
import { formatDate } from '../helpers/formatters'
import type { Ticket } from '../models/ticket'

export default function PageTicketForm() {
  const { idticket } = useParams()
  const navigate = useNavigate()
  const ticketFormRef = useRef<HTMLFormElement>(null)
  const [ticket, setTicket] = useState<Ticket>()
  const [status, setStatus] = useState('open')
  const [responsible, setResponsible] = useState('')
  const [resolutionType, setResolutionType] = useState('')
  const [resolutionSummary, setResolutionSummary] = useState('')
  const [isLoading, setIsLoading] = useState(Boolean(idticket))
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')
  const [saveError, setSaveError] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const isEditing = Boolean(idticket)
  const showResponsible = ['in_progress', 'resolved', 'closed'].includes(status)
  const showResolution = status === 'resolved' || status === 'closed'
  const returnPath = idticket ? `/tickets/${idticket}` : '/'

  const loadTicket = useCallback(async () => {
    try {
      setIsLoading(true)
      setError('')
      setSaveError('')

      if (!idticket) {
        setTicket(undefined)
        setStatus('open')
        setResponsible('')
        setResolutionType('')
        setResolutionSummary('')
        return
      }

      const ticketResponse: { ticket: Ticket } = await api(`/tickets/${idticket}`)
      setTicket(ticketResponse.ticket)
      setStatus(ticketResponse.ticket.status)
      setResponsible(ticketResponse.ticket.responsavel ?? '')
      setResolutionType(ticketResponse.ticket.tipoResolucao ?? '')
      setResolutionSummary(ticketResponse.ticket.resumoResolucao ?? '')
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

  useEffect(() => {
    loadTicket()
  }, [loadTicket])

  async function handleSaveTicket(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!ticketFormRef.current || isSaving || isDeleting) {
      return
    }

    setSaveError('')
    const ticketForm = new FormData(ticketFormRef.current)
    const ticketPayload = {
      titulo: String(ticketForm.get('titulo') ?? ''),
      descricao: String(ticketForm.get('descricao') ?? ''),
      categoria: String(ticketForm.get('categoria') ?? ''),
      prioridade: String(ticketForm.get('prioridade') ?? ''),
      status,
      solicitante: String(ticketForm.get('solicitante') ?? ''),
      responsavel: responsible || null,
      tipoResolucao: resolutionType || null,
      resumoResolucao: resolutionSummary || null,
    }

    if (ticketPayload.titulo.length < 5) {
      setSaveError('Título: muito pequeno; esperado texto com pelo menos 5 caracteres.')
      return
    }
    if (ticketPayload.descricao.length < 20) {
      setSaveError('Descrição: muito pequena; esperado texto com pelo menos 20 caracteres.')
      return
    }
    if (
      !['Access', 'Hardware', 'Software', 'Network', 'Security', 'Other'].includes(
        ticketPayload.categoria,
      )
    ) {
      setSaveError('Categoria: opção inválida. Selecione uma das categorias disponíveis.')
      return
    }
    if (!['low', 'medium', 'high', 'critical'].includes(ticketPayload.prioridade)) {
      setSaveError('Prioridade: opção inválida. Selecione uma das prioridades disponíveis.')
      return
    }
    if (!['open', 'triage', 'in_progress', 'resolved', 'closed'].includes(status)) {
      setSaveError('Status: opção inválida. Selecione um dos status disponíveis.')
      return
    }
    if (showResponsible && !responsible) {
      setSaveError('Responsável é obrigatório para o status atual.')
      return
    }
    if (showResolution && !resolutionType) {
      setSaveError('Tipo de resolução é obrigatório para o status atual.')
      return
    }
    if (
      resolutionType &&
      !['fixed', 'workaround', 'no_issue', 'duplicate', 'cancelled'].includes(resolutionType)
    ) {
      setSaveError('Tipo de resolução: opção inválida. Selecione uma das opções disponíveis.')
      return
    }
    if (showResolution && !resolutionSummary) {
      setSaveError('Resumo da resolução é obrigatório para o status atual.')
      return
    }
    if (resolutionSummary && resolutionSummary.length < 10) {
      setSaveError(
        'Resumo da resolução: muito pequeno; esperado texto com pelo menos 10 caracteres.',
      )
      return
    }

    try {
      setIsSaving(true)

      if (isEditing) {
        await api(`/tickets/${idticket}`, { method: 'PUT', body: JSON.stringify(ticketPayload) })
      } else {
        await api('/tickets', { method: 'POST', body: JSON.stringify(ticketPayload) })
      }

      navigate(returnPath)
    } catch (requestError) {
      setSaveError(
        requestError instanceof Error ? requestError.message : 'Não foi possível salvar o chamado.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDeleteTicket() {
    if (!idticket || isDeleting) {
      return
    }

    try {
      setIsDeleting(true)
      setDeleteError('')
      await api(`/tickets/${idticket}`, { method: 'DELETE' })
      setDeleteModalOpen(false)
      navigate('/')
    } catch (requestError) {
      setDeleteError(
        requestError instanceof Error
          ? requestError.message
          : 'Não foi possível excluir o chamado.',
      )
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        backTo={isSaving || isDeleting ? undefined : returnPath}
        description={
          isEditing
            ? 'Atualize as informações e mantenha o andamento do chamado organizado.'
            : 'Registre uma nova solicitação para iniciar o acompanhamento.'
        }
        eyebrow={isEditing ? 'Alteração de ticket' : 'Novo registro'}
        title={isEditing ? 'Editar chamado' : 'Novo chamado'}
      />

      {isLoading ? (
        <TicketListSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={loadTicket} />
      ) : (
        <form key={idticket ?? 'new'} noValidate onSubmit={handleSaveTicket} ref={ticketFormRef}>
          <fieldset className="space-y-6" disabled={isSaving || isDeleting}>
            <section className="rounded-2xl border border-border bg-white p-5 shadow-card sm:p-6">
              <div className="mb-6">
                <h2 className="text-base font-semibold text-text">Informações principais</h2>
                <p className="mt-1 text-sm text-text-muted">
                  Dados que identificam e contextualizam a solicitação.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Field className="md:col-span-2" htmlFor="titulo" label="Título">
                  <Input
                    defaultValue={ticket?.titulo ?? ''}
                    minLength={5}
                    required
                    id="titulo"
                    name="titulo"
                    placeholder="Descreva o problema em uma frase"
                  />
                </Field>

                <Field htmlFor="solicitante" label="Solicitante">
                  <Input
                    defaultValue={ticket?.solicitante ?? ''}
                    id="solicitante"
                    name="solicitante"
                    placeholder="Nome de quem abriu o chamado"
                  />
                </Field>

                {showResponsible && (
                  <Field htmlFor="responsavel" label="Responsável">
                    <Input
                      value={responsible}
                      onChange={(event) => setResponsible(event.target.value)}
                      required={showResponsible}
                      id="responsavel"
                      name="responsavel"
                      placeholder="Pessoa responsável pelo atendimento"
                    />
                  </Field>
                )}

                <Field htmlFor="status" label="Status">
                  <Select
                    id="status"
                    name="status"
                    onChange={(event) => setStatus(event.target.value)}
                    value={status}
                  >
                    <option value="open">Aberto</option>
                    <option value="triage">Em triagem</option>
                    <option value="in_progress">Em andamento</option>
                    <option value="resolved">Resolvido</option>
                    <option value="closed">Fechado</option>
                  </Select>
                </Field>

                <Field htmlFor="categoria" label="Categoria">
                  <Select
                    defaultValue={ticket?.categoria ?? 'Access'}
                    id="categoria"
                    name="categoria"
                  >
                    <option value="Access">Acesso</option>
                    <option value="Hardware">Hardware</option>
                    <option value="Software">Software</option>
                    <option value="Network">Rede</option>
                    <option value="Security">Segurança</option>
                    <option value="Other">Outro</option>
                  </Select>
                </Field>

                <Field htmlFor="prioridade" label="Prioridade">
                  <Select
                    defaultValue={ticket?.prioridade ?? 'medium'}
                    id="prioridade"
                    name="prioridade"
                  >
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                    <option value="critical">Crítica</option>
                  </Select>
                </Field>

                <Field className="md:col-span-2" htmlFor="descricao" label="Descrição">
                  <Textarea
                    defaultValue={ticket?.descricao ?? ''}
                    minLength={20}
                    required
                    id="descricao"
                    name="descricao"
                    placeholder="Explique o que aconteceu e o impacto causado"
                    rows={5}
                  />
                </Field>
              </div>
            </section>

            {showResolution && (
              <section className="rounded-2xl border border-border bg-white p-5 shadow-card sm:p-6">
                <div className="mb-6">
                  <h2 className="text-base font-semibold text-text">Resolução</h2>
                  <p className="mt-1 text-sm text-text-muted">
                    Registre a solução aplicada para manter o histórico completo.
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <Field htmlFor="tipoResolucao" label="Tipo de solução">
                    <Select
                      value={resolutionType}
                      onChange={(event) => setResolutionType(event.target.value)}
                      required={showResolution}
                      id="tipoResolucao"
                      name="tipoResolucao"
                    >
                      <option value="">Selecione o tipo de solução</option>
                      <option value="fixed">Correção definitiva</option>
                      <option value="workaround">Solução alternativa</option>
                      <option value="no_issue">Nenhum problema encontrado</option>
                      <option value="duplicate">Chamado duplicado</option>
                      <option value="cancelled">Cancelado</option>
                    </Select>
                  </Field>

                  <Field
                    hint="Gerada automaticamente"
                    htmlFor="resolvedAt"
                    label="Data da resolução"
                  >
                    <Input
                      id="resolvedAt"
                      placeholder="Definida pelo servidor ao salvar"
                      readOnly
                      value={ticket?.resolvedAt ? formatDate(ticket.resolvedAt) : ''}
                    />
                  </Field>

                  {(status === 'closed' || ticket?.closedAt) && (
                    <Field
                      hint="Gerada automaticamente"
                      htmlFor="closedAt"
                      label="Data do fechamento"
                    >
                      <Input
                        id="closedAt"
                        placeholder="Definida pelo servidor ao salvar"
                        readOnly
                        value={ticket?.closedAt ? formatDate(ticket.closedAt) : ''}
                      />
                    </Field>
                  )}

                  <Field
                    className="md:col-span-2"
                    htmlFor="resumoResolucao"
                    label="Resumo da resolução"
                  >
                    <Textarea
                      value={resolutionSummary}
                      onChange={(event) => setResolutionSummary(event.target.value)}
                      minLength={10}
                      required={showResolution}
                      id="resumoResolucao"
                      name="resumoResolucao"
                      placeholder="Descreva de forma objetiva como o chamado foi resolvido"
                      rows={4}
                    />
                  </Field>
                </div>
              </section>
            )}

            {saveError && (
              <p
                className="rounded-xl border border-danger/20 bg-danger-soft p-4 text-sm text-danger"
                role="alert"
              >
                {saveError}
              </p>
            )}

            <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                {isEditing && (
                  <Button
                    icon="trash"
                    onClick={() => {
                      setDeleteError('')
                      setDeleteModalOpen(true)
                    }}
                    type="button"
                    variant="ghost"
                  >
                    Excluir chamado
                  </Button>
                )}
              </div>

              <div className="flex flex-col-reverse gap-2 sm:flex-row">
                <Button onClick={() => navigate(returnPath)} type="button" variant="secondary">
                  Cancelar
                </Button>
                <Button icon="check" type="submit">
                  {isSaving ? 'Salvando chamado...' : 'Salvar chamado'}
                </Button>
              </div>
            </div>
          </fieldset>
        </form>
      )}

      <ConfirmModal
        description="O chamado e todas as atividades vinculadas serão removidos permanentemente."
        onCancel={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteTicket}
        isDeleting={isDeleting}
        error={deleteError}
        open={deleteModalOpen}
        title="Excluir chamado?"
      />
    </div>
  )
}
