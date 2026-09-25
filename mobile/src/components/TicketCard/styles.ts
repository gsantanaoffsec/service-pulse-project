import { StyleSheet } from 'react-native'

import { colors } from '@/theme/colors'

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    gap: 12,
  },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  code: { color: colors.primary, fontWeight: '700', fontSize: 12 },
  date: { color: colors.soft, fontSize: 12 },
  dateGroup: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  title: { color: colors.text, fontWeight: '700', fontSize: 17 },
  description: { color: colors.muted, lineHeight: 20, fontSize: 13 },
  badges: { flexDirection: 'row', gap: 8 },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: { color: colors.muted, fontSize: 12 },
  activityCount: { flexDirection: 'row', alignItems: 'center', gap: 5 },
})
