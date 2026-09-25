import { StyleSheet } from 'react-native'

import { colors } from '@/theme/colors'

export const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary, marginTop: 20 },
  card: { flex: 1, backgroundColor: colors.white, borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: 15, gap: 10 },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6 },
  date: { color: colors.soft, fontSize: 10, flexShrink: 1 },
  description: { color: colors.text, fontSize: 13, lineHeight: 20 },
  meta: { color: colors.muted, fontSize: 12 },
  actions: { flexDirection: 'row', gap: 18, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 10 },
  action: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  editText: { color: colors.primary, fontWeight: '600', fontSize: 12 },
  deleteText: { color: colors.danger, fontWeight: '600', fontSize: 12 },
})
