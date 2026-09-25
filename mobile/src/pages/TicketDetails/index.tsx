import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { ActivityItem } from '@/components/ActivityItem'
import { ConfirmModal } from '@/components/ConfirmModal'
import { SelectField } from '@/components/SelectField'
import { StatusBadge } from '@/components/StatusBadge'
import { api } from '@/helpers/api'
import {
  categoryLabels,
  formatDateTime,
  formatTicketCode,
  resolutionLabels,
} from '@/helpers/formatters'
import type { Ticket, TicketActivitiesResponse, TicketActivity } from '@/models/ticket'
import { colors } from '@/theme/colors'

import { styles } from './styles'

interface TicketDetailsProps {
  idticket: string
}

const activityTypeOptions = [
  { label: 'Todas as atividades', value: '' },
  { label: 'Comentário', value: 'comment' },
  { label: 'Diagnóstico', value: 'diagnosis' },
  { label: 'Ação', value: 'action' },
]

const pageSize = 10

export function TicketDetails({ idticket }: TicketDetailsProps) {
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [activities, setActivities] = useState<TicketActivity[]>([])
  const [activityToDelete, setActivityToDelete] = useState<string | null>(null)
  const [activityType, setActivityType] = useState('')
  const [authorInput, setAuthorInput] = useState('')
  const [author, setAuthor] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingActivities, setIsLoadingActivities] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')
  const [activitiesError, setActivitiesError] = useState('')
  const [deleteError, setDeleteError] = useState('')

  const loadTicket = useCallback(async () => {
    try {
      setIsLoading(true)
      setError('')
      const response = await api<{ ticket: Ticket }>(`/tickets/${idticket}`)
      setTicket(response.ticket)
    } catch (requestError) {
      setTicket(null)
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
    const params = new URLSearchParams({ _page: String(page), _limit: String(pageSize) })

    if (activityType) {
      params.set('tipo', activityType)
    }

    if (author.trim()) {
      params.set('autor', author.trim())
    }

    try {
      setIsLoadingActivities(true)
      setActivitiesError('')
      const response = await api<TicketActivitiesResponse>(
        `/tickets/${idticket}/activities?${params.toString()}`,
      )
      setActivities(response.items)
      setTotal(response.total)
    } catch (requestError) {
      setActivities([])
      setTotal(0)
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

  function handleActivityTypeChange(value: string) {
    if (value === activityType) {
      return
    }

    setActivityType(value)
    setPage(1)
  }

  function handleFilterAuthor() {
    if (author === authorInput.trim() && page === 1) {
      return
    }

    setAuthor(authorInput.trim())
    setPage(1)
  }

  async function handleDeleteActivity() {
    if (!activityToDelete || isDeleting) {
      return
    }

    try {
      setIsDeleting(true)
      setDeleteError('')
      await api<void>(`/activities/${activityToDelete}`, { method: 'DELETE' })
      setActivityToDelete(null)

      if (activities.length === 1 && page > 1) {
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
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.listState}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.empty}>Carregando chamado...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (!ticket) {
    return (
      <SafeAreaView style={styles.screen}>
        <Pressable style={styles.back} onPress={() => router.replace('/')}>
          <Ionicons name="arrow-back" size={20} color={colors.primary} />
          <Text style={styles.backText}>Voltar aos chamados</Text>
        </Pressable>
        <Text style={styles.empty}>{error || 'Chamado não encontrado.'}</Text>
        <Pressable style={styles.retryButton} onPress={loadTicket}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </Pressable>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable style={styles.back} onPress={() => router.replace('/')}>
          <Ionicons name="arrow-back" size={20} color={colors.primary} />
          <Text style={styles.backText}>Voltar aos chamados</Text>
        </Pressable>
        <View style={styles.titleRow}>
          <View style={styles.titleGroup}>
            <Text style={styles.code}>{formatTicketCode(ticket.idticket)}</Text>
            <Text style={styles.title}>{ticket.titulo}</Text>
          </View>
          <Pressable
            style={styles.editButton}
            onPress={() =>
              router.push({ pathname: '/tickets/[idticket]/edit', params: { idticket } })
            }
          >
            <Ionicons name="pencil-outline" size={16} color={colors.primary} />
            <Text style={styles.editText}>Editar</Text>
          </Pressable>
        </View>
        <View style={styles.badges}>
          <StatusBadge type="status" value={ticket.status} />
          <StatusBadge type="priority" value={ticket.prioridade} />
        </View>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Informações do chamado</Text>
          <DetailRow label="Solicitante" value={ticket.solicitante} />
          <DetailRow label="Responsável" value={ticket.responsavel ?? 'Não atribuído'} />
          <DetailRow
            label="Categoria"
            value={categoryLabels[ticket.categoria] ?? ticket.categoria}
          />
          <DetailRow label="Criado em" value={formatDateTime(ticket.createdAt)} />
          <DetailRow label="Atualizado em" value={formatDateTime(ticket.updatedAt)} />
          {ticket.tipoResolucao && (
            <DetailRow
              label="Tipo de resolução"
              value={resolutionLabels[ticket.tipoResolucao] ?? ticket.tipoResolucao}
            />
          )}
          {ticket.resumoResolucao && (
            <DetailRow label="Resumo da resolução" value={ticket.resumoResolucao} />
          )}
          {ticket.resolvedAt && (
            <DetailRow label="Resolvido em" value={formatDateTime(ticket.resolvedAt)} />
          )}
          {ticket.closedAt && (
            <DetailRow label="Fechado em" value={formatDateTime(ticket.closedAt)} />
          )}
          <Text style={styles.descriptionLabel}>Descrição</Text>
          <Text style={styles.description}>{ticket.descricao}</Text>
        </View>
        <View style={styles.activitiesTitleRow}>
          <Text style={styles.sectionTitle}>Atividades ({total})</Text>
          <Pressable
            style={styles.newActivity}
            onPress={() =>
              router.push({ pathname: '/tickets/[idticket]/activities/new', params: { idticket } })
            }
          >
            <Ionicons name="add" size={18} color={colors.white} />
            <Text style={styles.newActivityText}>Nova</Text>
          </Pressable>
        </View>
        <View style={styles.filters}>
          <SelectField
            label="Tipo"
            value={activityType}
            onChange={handleActivityTypeChange}
            options={activityTypeOptions}
          />
          <Text style={styles.filterLabel}>Autor</Text>
          <View style={styles.authorFilter}>
            <TextInput
              style={styles.authorInput}
              value={authorInput}
              onChangeText={setAuthorInput}
              onSubmitEditing={handleFilterAuthor}
              placeholder="Buscar por autor"
              placeholderTextColor={colors.soft}
              returnKeyType="search"
            />
            <Pressable style={styles.filterButton} onPress={handleFilterAuthor}>
              <Ionicons name="search" size={18} color={colors.white} />
            </Pressable>
          </View>
        </View>
        {isLoadingActivities && (
          <View style={styles.listState}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.emptyActivities}>Carregando atividades...</Text>
          </View>
        )}
        {!isLoadingActivities && activitiesError && (
          <View style={styles.listState}>
            <Text style={styles.emptyActivities}>{activitiesError}</Text>
            <Pressable style={styles.retryButton} onPress={loadActivities}>
              <Text style={styles.retryText}>Tentar novamente</Text>
            </Pressable>
          </View>
        )}
        {!isLoadingActivities && !activitiesError && activities.length === 0 && (
          <Text style={styles.emptyActivities}>Nenhuma atividade encontrada.</Text>
        )}
        {!isLoadingActivities && !activitiesError && (
          <View style={styles.timeline}>
            {activities.map((activity) => (
              <ActivityItem
                key={activity.idactivity}
                activity={activity}
                onEdit={() =>
                  router.push({
                    pathname: '/tickets/[idticket]/activities/[idactivity]/edit',
                    params: { idticket, idactivity: activity.idactivity },
                  })
                }
                onDelete={() => {
                  setDeleteError('')
                  setActivityToDelete(activity.idactivity)
                }}
              />
            ))}
          </View>
        )}
        {!isLoadingActivities && !activitiesError && total > pageSize && (
          <View style={styles.pagination}>
            <Pressable
              style={[styles.pageButton, page === 1 && styles.pageButtonDisabled]}
              disabled={page === 1}
              onPress={() => setPage(page - 1)}
            >
              <Text style={styles.pageButtonText}>Anterior</Text>
            </Pressable>
            <Text style={styles.pageLabel}>Página {page}</Text>
            <Pressable
              style={[styles.pageButton, page * pageSize >= total && styles.pageButtonDisabled]}
              disabled={page * pageSize >= total}
              onPress={() => setPage(page + 1)}
            >
              <Text style={styles.pageButtonText}>Próxima</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
      <ConfirmModal
        visible={activityToDelete !== null}
        title="Excluir atividade?"
        description="Esta atividade será removida do chamado. Essa ação não pode ser desfeita."
        onCancel={() => setActivityToDelete(null)}
        onConfirm={handleDeleteActivity}
        isLoading={isDeleting}
        error={deleteError}
      />
    </SafeAreaView>
  )
}

interface DetailRowProps {
  label: string
  value: string
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  )
}
