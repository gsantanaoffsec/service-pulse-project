import { Pressable, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import { StatusBadge } from '@/components/StatusBadge'
import { categoryLabels, formatRelativeDate, formatTicketCode } from '@/helpers/formatters'
import type { Ticket } from '@/models/ticket'
import { colors } from '@/theme/colors'

import { styles } from './styles'

interface TicketCardProps {
  ticket: Ticket
  onPress: () => void
}

export function TicketCard({ ticket, onPress }: TicketCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.top}>
        <Text style={styles.code}>{formatTicketCode(ticket.idticket)}</Text>
        <View style={styles.dateGroup}>
          <Ionicons name="calendar-outline" size={13} color={colors.soft} />
          <Text style={styles.date}>{formatRelativeDate(ticket.updatedAt)}</Text>
        </View>
      </View>
      <Text style={styles.title}>{ticket.titulo}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {ticket.descricao}
      </Text>
      <View style={styles.badges}>
        <StatusBadge type="status" value={ticket.status} />
        <StatusBadge type="priority" value={ticket.prioridade} />
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {categoryLabels[ticket.categoria] ?? ticket.categoria}
        </Text>
        <View style={styles.activityCount}>
          <Ionicons name="chatbubble-outline" size={14} color={colors.muted} />
          <Text style={styles.footerText}>{ticket.activitiesCount ?? 0}</Text>
        </View>
      </View>
    </Pressable>
  )
}
