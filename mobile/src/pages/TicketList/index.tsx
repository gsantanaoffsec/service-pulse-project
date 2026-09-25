import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { AppHeader } from '@/components/AppHeader'
import { SelectField } from '@/components/SelectField'
import { TicketCard } from '@/components/TicketCard'
import { api } from '@/helpers/api'
import type { Ticket, TicketsResponse } from '@/models/ticket'
import { colors } from '@/theme/colors'

import { styles } from './styles'

const statusOptions = [
  { label: 'Todos os status', value: '' },
  { label: 'Aberto', value: 'open' },
  { label: 'Triagem', value: 'triage' },
  { label: 'Em andamento', value: 'in_progress' },
  { label: 'Resolvido', value: 'resolved' },
  { label: 'Fechado', value: 'closed' },
]

const categoryOptions = [
  { label: 'Todas as categorias', value: '' },
  { label: 'Acesso', value: 'Access' },
  { label: 'Hardware', value: 'Hardware' },
  { label: 'Software', value: 'Software' },
  { label: 'Rede', value: 'Network' },
  { label: 'Segurança', value: 'Security' },
  { label: 'Outro', value: 'Other' },
]

const priorityOptions = [
  { label: 'Todas as prioridades', value: '' },
  { label: 'Baixa', value: 'low' },
  { label: 'Média', value: 'medium' },
  { label: 'Alta', value: 'high' },
  { label: 'Crítica', value: 'critical' },
]

const pageSize = 10

export function TicketList() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [category, setCategory] = useState('')
  const [priority, setPriority] = useState('')

  const [tickets, setTickets] = useState<Ticket[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let isCurrentRequest = true

    async function loadTickets() {
      const params = new URLSearchParams()

      if (search.trim()) {
        params.set('q', search.trim())
      }

      if (status) {
        params.set('status', status)
      }

      if (category) {
        params.set('categoria', category)
      }

      if (priority) {
        params.set('prioridade', priority)
      }

      params.set('_page', String(page))
      params.set('_limit', String(pageSize))

      try {
        const response = await api<TicketsResponse>(`/tickets?${params.toString()}`)

        if (isCurrentRequest) {
          setTickets(response.items)
          setTotal(response.total)
          setError('')
        }
      } catch (requestError) {
        if (isCurrentRequest) {
          setTickets([])
          setTotal(0)
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'Não foi possível carregar os chamados.',
          )
        }
      } finally {
        if (isCurrentRequest) {
          setIsLoading(false)
          setIsRefreshing(false)
        }
      }
    }

    loadTickets()

    return () => {
      isCurrentRequest = false
    }
  }, [search, status, category, priority, page, retryCount])

  function handleSearchChange(value: string) {
    setIsLoading(true)
    setSearch(value)
    setPage(1)
  }

  function handleStatusChange(value: string) {
    if (value === status) {
      return
    }

    setIsLoading(true)
    setStatus(value)
    setPage(1)
  }

  function handleCategoryChange(value: string) {
    if (value === category) {
      return
    }

    setIsLoading(true)
    setCategory(value)
    setPage(1)
  }

  function handlePriorityChange(value: string) {
    if (value === priority) {
      return
    }

    setIsLoading(true)
    setPriority(value)
    setPage(1)
  }

  function handlePageChange(nextPage: number) {
    setIsLoading(true)
    setPage(nextPage)
  }

  function handleRetry() {
    setIsLoading(true)
    setError('')
    setRetryCount((currentCount) => currentCount + 1)
  }

  function handleRefresh() {
    if (isRefreshing) {
      return
    }

    setIsRefreshing(true)
    setRetryCount((currentCount) => currentCount + 1)
  }

  function renderListState() {
    if (isLoading) {
      return (
        <View style={styles.listState}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.empty}>Carregando chamados...</Text>
        </View>
      )
    }

    if (error) {
      return (
        <View style={styles.listState}>
          <Text style={styles.empty}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryText}>Tentar novamente</Text>
          </Pressable>
        </View>
      )
    }

    return <Text style={styles.empty}>Nenhum chamado encontrado.</Text>
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <AppHeader />
      <FlatList
        data={isLoading || error ? [] : tickets}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        keyExtractor={(ticket) => ticket.idticket}
        contentContainerStyle={styles.content}
        renderItem={({ item: ticket }) => (
          <TicketCard
            ticket={ticket}
            onPress={() =>
              router.push({
                pathname: '/tickets/[idticket]',
                params: { idticket: ticket.idticket },
              })
            }
          />
        )}
        ListHeaderComponent={
          <View style={styles.headerContent}>
            <Text style={styles.eyebrow}>VISÃO GERAL</Text>
            <Text style={styles.heading}>Chamados</Text>
            <Text style={styles.subheading}>
              Acompanhe solicitações, prioridades e movimentações em um só lugar.
            </Text>
            <View style={styles.filters}>
              <View style={styles.searchBox}>
                <Ionicons name="search-outline" size={19} color={colors.soft} />
                <TextInput
                  style={styles.searchInput}
                  value={search}
                  onChangeText={handleSearchChange}
                  placeholder="Buscar por título, solicitante..."
                  placeholderTextColor={colors.soft}
                />
              </View>
              <SelectField
                label="Status"
                value={status}
                onChange={handleStatusChange}
                options={statusOptions}
              />
              <SelectField
                label="Categoria"
                value={category}
                onChange={handleCategoryChange}
                options={categoryOptions}
              />
              <SelectField
                label="Prioridade"
                value={priority}
                onChange={handlePriorityChange}
                options={priorityOptions}
              />
            </View>
            <Text style={styles.count}>
              {isLoading ? 'Carregando chamados...' : `${total} chamados encontrados`}
            </Text>
          </View>
        }
        ListEmptyComponent={renderListState}
        ListFooterComponent={
          !isLoading && !error && total > pageSize ? (
            <View style={styles.pagination}>
              <Pressable
                style={[styles.pageButton, page === 1 && styles.pageButtonDisabled]}
                onPress={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                <Text style={styles.pageButtonText}>Anterior</Text>
              </Pressable>
              <Text style={styles.pageLabel}>Página {page}</Text>
              <Pressable
                style={[styles.pageButton, page * pageSize >= total && styles.pageButtonDisabled]}
                onPress={() => handlePageChange(page + 1)}
                disabled={page * pageSize >= total}
              >
                <Text style={styles.pageButtonText}>Próxima</Text>
              </Pressable>
            </View>
          ) : null
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      <Pressable style={styles.floatingButton} onPress={() => router.push('/tickets/new')}>
        <Ionicons name="add" size={22} color={colors.white} />
        <Text style={styles.floatingText}>Novo</Text>
      </Pressable>
    </SafeAreaView>
  )
}
