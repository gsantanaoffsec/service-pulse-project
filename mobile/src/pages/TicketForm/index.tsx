import { useCallback, useEffect, useState } from 'react'
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { ConfirmModal } from '@/components/ConfirmModal'
import { FormField } from '@/components/FormField'
import { SelectField } from '@/components/SelectField'
import { api } from '@/helpers/api'
import { formatDateTime } from '@/helpers/formatters'
import type { Ticket } from '@/models/ticket'
import { colors } from '@/theme/colors'

import { styles } from './styles'

interface TicketFormProps {
  mode: 'create' | 'edit'
  idticket?: string
}

const statusOptions = [
  { label: 'Aberto', value: 'open' },
  { label: 'Triagem', value: 'triage' },
  { label: 'Em andamento', value: 'in_progress' },
  { label: 'Resolvido', value: 'resolved' },
  { label: 'Fechado', value: 'closed' },
]

const categoryOptions = [
  { label: 'Acesso', value: 'Access' },
  { label: 'Hardware', value: 'Hardware' },
  { label: 'Software', value: 'Software' },
  { label: 'Rede', value: 'Network' },
  { label: 'Segurança', value: 'Security' },
  { label: 'Outro', value: 'Other' },
]

const priorityOptions = [
  { label: 'Baixa', value: 'low' },
  { label: 'Média', value: 'medium' },
  { label: 'Alta', value: 'high' },
  { label: 'Crítica', value: 'critical' },
]

const resolutionOptions = [
  { label: 'Corrigido', value: 'fixed' },
  { label: 'Solução alternativa', value: 'workaround' },
  { label: 'Sem problema identificado', value: 'no_issue' },
  { label: 'Duplicado', value: 'duplicate' },
  { label: 'Cancelado', value: 'cancelled' },
]

export function TicketForm({ mode, idticket }: TicketFormProps) {
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [title, setTitle] = useState('')
  const [requester, setRequester] = useState('')
  const [assignee, setAssignee] = useState('')
  const [status, setStatus] = useState('open')
  const [category, setCategory] = useState('')
  const [priority, setPriority] = useState('')
  const [description, setDescription] = useState('')
  const [resolutionType, setResolutionType] = useState('')
  const [resolutionSummary, setResolutionSummary] = useState('')
  const [showDelete, setShowDelete] = useState(false)
  const [isLoading, setIsLoading] = useState(mode === 'edit')
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')
  const [saveError, setSaveError] = useState('')
  const [deleteError, setDeleteError] = useState('')

  const loadTicket = useCallback(async () => {
    if (mode !== 'edit') {
      return
    }

    if (!idticket) {
      setError('Chamado não encontrado.')
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError('')
      const response = await api<{ ticket: Ticket }>(`/tickets/${idticket}`)
      const loadedTicket = response.ticket
      setTicket(loadedTicket)
      setTitle(loadedTicket.titulo)
      setRequester(loadedTicket.solicitante)
      setAssignee(loadedTicket.responsavel ?? '')
      setStatus(loadedTicket.status)
      setCategory(loadedTicket.categoria)
      setPriority(loadedTicket.prioridade)
      setDescription(loadedTicket.descricao)
      setResolutionType(loadedTicket.tipoResolucao ?? '')
      setResolutionSummary(loadedTicket.resumoResolucao ?? '')
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Não foi possível carregar o chamado.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [mode, idticket])

  useEffect(() => {
    loadTicket()
  }, [loadTicket])

  function handleCancel() {
    if (mode === 'edit' && idticket) {
      router.replace({ pathname: '/tickets/[idticket]', params: { idticket } })
      return
    }

    router.replace('/')
  }

  async function handleSaveTicket() {
    if (isSaving || isDeleting || (mode === 'edit' && (!idticket || !ticket))) {
      return
    }

    setSaveError('')

    if (title.trim().length < 5) {
      setSaveError('Título: muito pequeno; esperado texto com pelo menos 5 caracteres.')
      return
    }

    if (description.trim().length < 20) {
      setSaveError('Descrição: muito pequena; esperado texto com pelo menos 20 caracteres.')
      return
    }

    if (!requester.trim()) {
      setSaveError('Informe o solicitante do chamado.')
      return
    }

    if (!categoryOptions.some((option) => option.value === category)) {
      setSaveError('Categoria: opção inválida. Selecione uma das categorias disponíveis.')
      return
    }

    if (!priorityOptions.some((option) => option.value === priority)) {
      setSaveError('Prioridade: opção inválida. Selecione uma das prioridades disponíveis.')
      return
    }

    if (!statusOptions.some((option) => option.value === status)) {
      setSaveError('Status: opção inválida. Selecione um dos status disponíveis.')
      return
    }

    if (needsAssignee && !assignee.trim()) {
      setSaveError('Responsável é obrigatório para o status atual.')
      return
    }

    if (needsResolution && !resolutionType) {
      setSaveError('Tipo de resolução é obrigatório para o status atual.')
      return
    }

    if (resolutionType && !resolutionOptions.some((option) => option.value === resolutionType)) {
      setSaveError('Tipo de resolução: opção inválida. Selecione uma das opções disponíveis.')
      return
    }

    if (needsResolution && !resolutionSummary.trim()) {
      setSaveError('Resumo da resolução é obrigatório para o status atual.')
      return
    }

    if (resolutionSummary.trim() && resolutionSummary.trim().length < 10) {
      setSaveError(
        'Resumo da resolução: muito pequeno; esperado texto com pelo menos 10 caracteres.',
      )
      return
    }

    const body = {
      titulo: title.trim(),
      solicitante: requester.trim(),
      responsavel: assignee.trim() || null,
      status,
      categoria: category,
      prioridade: priority,
      descricao: description.trim(),
      tipoResolucao: resolutionType || null,
      resumoResolucao: resolutionSummary.trim() || null,
    }

    try {
      setIsSaving(true)

      if (mode === 'edit' && idticket) {
        await api<{ ticket: Ticket }>(`/tickets/${idticket}`, {
          method: 'PUT',
          body: JSON.stringify(body),
        })
        router.replace({ pathname: '/tickets/[idticket]', params: { idticket } })
      } else {
        await api<{ ticket: Ticket }>('/tickets', {
          method: 'POST',
          body: JSON.stringify(body),
        })
        router.replace('/')
      }
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
      await api<void>(`/tickets/${idticket}`, { method: 'DELETE' })
      setShowDelete(false)
      router.replace('/')
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

  const needsAssignee = ['in_progress', 'resolved', 'closed'].includes(status)
  const needsResolution = status === 'resolved' || status === 'closed'

  if (isLoading) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.listState}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.subheading}>Carregando chamado...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView style={styles.screen}>
        <Text style={styles.loadError}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={loadTicket}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </Pressable>
        <Pressable style={styles.back} onPress={handleCancel}>
          <Text style={styles.backText}>Cancelar</Text>
        </Pressable>
      </SafeAreaView>
    )
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <Pressable style={styles.back} onPress={handleCancel} disabled={isSaving || isDeleting}>
            <Ionicons name="arrow-back" size={20} color={colors.primary} />
            <Text style={styles.backText}>Cancelar</Text>
          </Pressable>
          <Text style={styles.eyebrow}>CHAMADO</Text>
          <Text style={styles.heading}>
            {mode === 'create' ? 'Novo chamado' : 'Editar chamado'}
          </Text>
          <Text style={styles.subheading}>Preencha as informações do chamado.</Text>
          <View style={styles.form}>
            <FormField
              label="Título"
              value={title}
              onChangeText={setTitle}
              placeholder="Título do chamado"
            />
            <FormField
              label="Solicitante"
              value={requester}
              onChangeText={setRequester}
              placeholder="Nome do solicitante"
            />
            <SelectField
              label="Status"
              value={status}
              onChange={setStatus}
              options={statusOptions}
            />
            <SelectField
              label="Categoria"
              value={category}
              onChange={setCategory}
              options={categoryOptions}
            />
            <SelectField
              label="Prioridade"
              value={priority}
              onChange={setPriority}
              options={priorityOptions}
            />
            {needsAssignee && (
              <FormField
                label="Responsável"
                value={assignee}
                onChangeText={setAssignee}
                placeholder="Nome do responsável"
              />
            )}
            <FormField
              label="Descrição"
              value={description}
              onChangeText={setDescription}
              placeholder="Descreva a solicitação"
              multiline
            />
            {needsResolution && (
              <>
                <SelectField
                  label="Tipo de resolução"
                  value={resolutionType}
                  onChange={setResolutionType}
                  options={resolutionOptions}
                />
                <FormField
                  label="Resumo da resolução"
                  value={resolutionSummary}
                  onChangeText={setResolutionSummary}
                  placeholder="Descreva a resolução"
                  multiline
                />
                <FormField
                  label="Resolvido em"
                  value={formatDateTime(ticket?.resolvedAt ?? null)}
                  editable={false}
                />
              </>
            )}
            {status === 'closed' && (
              <FormField
                label="Fechado em"
                value={formatDateTime(ticket?.closedAt ?? null)}
                editable={false}
              />
            )}
          </View>
          {saveError ? <Text style={styles.saveError}>{saveError}</Text> : null}
          <View style={styles.actions}>
            <Pressable
              style={styles.cancelButton}
              onPress={handleCancel}
              disabled={isSaving || isDeleting}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </Pressable>
            <Pressable
              style={[styles.saveButton, (isSaving || isDeleting) && styles.disabled]}
              onPress={handleSaveTicket}
              disabled={isSaving || isDeleting}
            >
              <Text style={styles.saveText}>{isSaving ? 'Salvando...' : 'Salvar'}</Text>
            </Pressable>
          </View>
          {mode === 'edit' && (
            <Pressable
              style={styles.deleteButton}
              onPress={() => {
                setDeleteError('')
                setShowDelete(true)
              }}
              disabled={isSaving || isDeleting}
            >
              <Ionicons name="trash-outline" size={17} color={colors.danger} />
              <Text style={styles.deleteText}>Excluir chamado</Text>
            </Pressable>
          )}
        </ScrollView>
        <ConfirmModal
          visible={showDelete}
          title="Excluir chamado?"
          description="O chamado e todas as suas atividades serão removidos. Essa ação não pode ser desfeita."
          onCancel={() => setShowDelete(false)}
          onConfirm={handleDeleteTicket}
          isLoading={isDeleting}
          error={deleteError}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}
