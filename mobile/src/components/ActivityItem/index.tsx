import { Pressable, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import { StatusBadge } from '@/components/StatusBadge'
import { formatDateTime } from '@/helpers/formatters'
import type { TicketActivity } from '@/models/ticket'
import { colors } from '@/theme/colors'

import { styles } from './styles'

interface ActivityItemProps {
  activity: TicketActivity
  onEdit: () => void
  onDelete: () => void
}

export function ActivityItem({ activity, onEdit, onDelete }: ActivityItemProps) {
  return (
    <View style={styles.row}>
      <View style={styles.dot} />
      <View style={styles.card}>
        <View style={styles.top}>
          <StatusBadge type="activity" value={activity.tipo} />
          <Text style={styles.date}>{formatDateTime(activity.createdAt)}</Text>
        </View>
        <Text style={styles.description}>{activity.descricao}</Text>
        <Text style={styles.meta}>{activity.autor}{activity.tempoGastoMinutos !== null ? ` · ${activity.tempoGastoMinutos} min` : ''}</Text>
        <View style={styles.actions}>
          <Pressable onPress={onEdit} style={styles.action} accessibilityLabel="Editar atividade">
            <Ionicons name="pencil-outline" size={16} color={colors.primary} />
            <Text style={styles.editText}>Editar</Text>
          </Pressable>
          <Pressable onPress={onDelete} style={styles.action} accessibilityLabel="Excluir atividade">
            <Ionicons name="trash-outline" size={16} color={colors.danger} />
            <Text style={styles.deleteText}>Excluir</Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}
