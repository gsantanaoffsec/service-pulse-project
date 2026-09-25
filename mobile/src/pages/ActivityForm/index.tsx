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

import { FormField } from '@/components/FormField'
import { SelectField } from '@/components/SelectField'
import { api } from '@/helpers/api'
import type { Ticket, TicketActivity } from '@/models/ticket'
import { colors } from '@/theme/colors'

import { styles } from './styles'

interface ActivityFormProps {
  mode: 'create' | 'edit'
  idticket: string
  idactivity?: string
}

const activityOptions = [
  { label: 'Comentário', value: 'comment' },
  { label: 'Diagnóstico', value: 'diagnosis' },
  { label: 'Ação', value: 'action' },
]

export function ActivityForm({ mode, idticket, idactivity }: ActivityFormProps) {
  const [type, setType] = useState('comment')
  const [description, setDescription] = useState('')
  const [author, setAuthor] = useState('')
  const [timeSpent, setTimeSpent] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [saveError, setSaveError] = useState('')

  const loadActivityForm = useCallback(async () => {
    try {
      setIsLoading(true)
      setError('')

      const ticketResponse = await api<{ ticket: Ticket }>(`/tickets/${idticket}`)

      if (mode === 'edit') {
        if (!idactivity) {
          throw new Error('Atividade não encontrada.')
        }

        const activityResponse = await api<{ ticketActivity: TicketActivity }>(
          `/activities/${idactivity}`,
        )
        const activity = activityResponse.ticketActivity

        if (activity.idticket !== ticketResponse.ticket.idticket) {
          throw new Error('Esta atividade não pertence ao chamado informado.')
        }

        setType(activity.tipo)
        setDescription(activity.descricao)
        setAuthor(activity.autor)
        setTimeSpent(activity.tempoGastoMinutos?.toString() ?? '')
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Não foi possível carregar os dados da atividade.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [mode, idticket, idactivity])

  useEffect(() => {
    loadActivityForm()
  }, [loadActivityForm])

  function handleCancel() {
    router.replace({ pathname: '/tickets/[idticket]', params: { idticket } })
  }

  async function handleSaveActivity() {
    if (isSaving) {
      return
    }

    setSaveError('')

    if (!activityOptions.some((option) => option.value === type)) {
      setSaveError('Tipo: opção inválida. Selecione comentário, diagnóstico ou ação.')
      return
    }

    if (description.trim().length < 10) {
      setSaveError('Descrição: muito pequena; esperado texto com pelo menos 10 caracteres.')
      return
    }

    if (author.trim().length < 2) {
      setSaveError('Autor: muito pequeno; esperado texto com pelo menos 2 caracteres.')
      return
    }

    const activityMinutes = timeSpent.trim()
    const minutes = Number(activityMinutes)

    if (activityMinutes !== '' && !Number.isInteger(minutes)) {
      setSaveError('Tempo gasto: tipo inválido; esperado número inteiro.')
      return
    }

    if (activityMinutes !== '' && minutes < 0) {
      setSaveError('Tempo gasto: muito pequeno; esperado número maior ou igual a 0.')
      return
    }

    if (activityMinutes !== '' && minutes > 1440) {
      setSaveError('Tempo gasto: muito grande; esperado número menor ou igual a 1440.')
      return
    }

    const body = {
      tipo: type,
      descricao: description.trim(),
      autor: author.trim(),
      ...(activityMinutes !== '' ? { tempoGastoMinutos: minutes } : {}),
    }

    try {
      setIsSaving(true)

      if (mode === 'edit' && idactivity) {
        await api<{ ticketActivity: TicketActivity }>(`/activities/${idactivity}`, {
          method: 'PUT',
          body: JSON.stringify(body),
        })
      } else {
        await api<{ ticketActivity: TicketActivity }>(`/tickets/${idticket}/activities`, {
          method: 'POST',
          body: JSON.stringify(body),
        })
      }

      router.replace({ pathname: '/tickets/[idticket]', params: { idticket } })
    } catch (requestError) {
      setSaveError(
        requestError instanceof Error
          ? requestError.message
          : 'Não foi possível salvar a atividade.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.listState}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.subheading}>Carregando atividade...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView style={styles.screen}>
        <Text style={styles.loadError}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={loadActivityForm}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </Pressable>
        <Pressable style={styles.back} onPress={handleCancel} disabled={isSaving}>
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
          <Pressable style={styles.back} onPress={handleCancel}>
            <Ionicons name="arrow-back" size={20} color={colors.primary} />
            <Text style={styles.backText}>Cancelar</Text>
          </Pressable>
          <Text style={styles.eyebrow}>ATIVIDADE</Text>
          <Text style={styles.heading}>
            {mode === 'create' ? 'Nova atividade' : 'Editar atividade'}
          </Text>
          <Text style={styles.subheading}>
            Registre uma atualização na linha do tempo do chamado.
          </Text>
          <View style={styles.form}>
            <SelectField label="Tipo" value={type} onChange={setType} options={activityOptions} />
            <FormField
              label="Descrição"
              value={description}
              onChangeText={setDescription}
              placeholder="Descreva a atividade"
              multiline
            />
            <FormField
              label="Autor"
              value={author}
              onChangeText={setAuthor}
              placeholder="Nome do autor"
            />
            <FormField
              label="Tempo gasto (minutos)"
              value={timeSpent}
              onChangeText={setTimeSpent}
              keyboardType="numeric"
              placeholder="Opcional"
            />
          </View>
          {saveError ? <Text style={styles.saveError}>{saveError}</Text> : null}
          <View style={styles.actions}>
            <Pressable style={styles.cancelButton} onPress={handleCancel} disabled={isSaving}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </Pressable>
            <Pressable
              style={[styles.saveButton, isSaving && styles.disabled]}
              onPress={handleSaveActivity}
              disabled={isSaving}
            >
              <Text style={styles.saveText}>{isSaving ? 'Salvando...' : 'Salvar'}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}
