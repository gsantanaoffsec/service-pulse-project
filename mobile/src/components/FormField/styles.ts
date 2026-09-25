import { StyleSheet } from 'react-native'

import { colors } from '@/theme/colors'

export const styles = StyleSheet.create({
  field: { gap: 7 },
  label: { color: colors.text, fontWeight: '600', fontSize: 13 },
  input: { backgroundColor: colors.white, borderColor: colors.border, borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, minHeight: 48, color: colors.text, fontSize: 14 },
  multiline: { minHeight: 105, paddingTop: 13 },
  readonly: { backgroundColor: colors.surface, color: colors.muted },
})
