import { StyleSheet } from 'react-native'

import { colors } from '@/theme/colors'

export const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'center', padding: 22 },
  card: { backgroundColor: colors.white, borderRadius: 20, padding: 22, gap: 12 },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.dangerSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { color: colors.text, fontWeight: '700', fontSize: 19 },
  description: { color: colors.muted, fontSize: 14, lineHeight: 21 },
  error: { color: colors.danger, fontSize: 13, lineHeight: 19 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 12 },
  cancel: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  cancelText: { color: colors.text, fontWeight: '700' },
  confirm: {
    flex: 1,
    backgroundColor: colors.danger,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  confirmText: { color: colors.white, fontWeight: '700' },
  disabled: { opacity: 0.5 },
})
