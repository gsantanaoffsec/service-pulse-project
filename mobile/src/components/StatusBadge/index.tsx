import { Text, View } from 'react-native'

import { statusLabels, priorityLabels, activityLabels } from '@/helpers/formatters'
import { colors } from '@/theme/colors'

import { styles } from './styles'

interface StatusBadgeProps {
  type: 'status' | 'priority' | 'activity'
  value: string
}

export function StatusBadge({ type, value }: StatusBadgeProps) {
  const badgeColors: Record<string, { text: string; background: string }> = {
    open: { text: colors.open, background: colors.openSoft },
    triage: { text: colors.triage, background: colors.triageSoft },
    in_progress: { text: colors.inProgress, background: colors.inProgressSoft },
    resolved: { text: colors.resolved, background: colors.resolvedSoft },
    closed: { text: colors.closed, background: colors.closedSoft },
    low: { text: colors.low, background: colors.lowSoft },
    medium: { text: colors.medium, background: colors.mediumSoft },
    high: { text: colors.high, background: colors.highSoft },
    critical: { text: colors.critical, background: colors.criticalSoft },
    comment: { text: colors.comment, background: colors.commentSoft },
    diagnosis: { text: colors.diagnosis, background: colors.diagnosisSoft },
    action: { text: colors.action, background: colors.actionSoft },
  }

  const badge = badgeColors[value] ?? { text: colors.muted, background: colors.surface }
  const labels = type === 'status' ? statusLabels : type === 'priority' ? priorityLabels : activityLabels

  return (
    <View style={[styles.badge, { backgroundColor: badge.background }]}>
      <Text style={[styles.label, { color: badge.text }]}>{labels[value] ?? value}</Text>
    </View>
  )
}
