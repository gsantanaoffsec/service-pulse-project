import { StyleSheet } from 'react-native'

import { colors } from '@/theme/colors'

export const styles = StyleSheet.create({
  field: { gap: 7 },
  label: { color: colors.text, fontWeight: '600', fontSize: 13 },
  select: { backgroundColor: colors.white, borderColor: colors.border, borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  value: { color: colors.text, fontSize: 14 },
  placeholder: { color: colors.soft },
  overlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'center', padding: 24 },
  sheet: { backgroundColor: colors.white, borderRadius: 18, padding: 18, maxHeight: '75%' },
  sheetTitle: { color: colors.text, fontSize: 18, fontWeight: '700', marginBottom: 12 },
  option: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  optionText: { color: colors.text, fontSize: 14 },
  active: { color: colors.primary, fontWeight: '700' },
  cancel: { alignItems: 'center', paddingTop: 18 },
  cancelText: { color: colors.muted, fontWeight: '600' },
})
