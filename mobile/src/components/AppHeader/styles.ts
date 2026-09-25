import { StyleSheet } from 'react-native'

import { colors } from '@/theme/colors'

export const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.white,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  identity: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logo: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 17, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 11, color: colors.muted },
  user: { borderRadius: 20, backgroundColor: colors.primarySoft, paddingHorizontal: 12, paddingVertical: 8 },
  userText: { color: colors.primary, fontWeight: '700', fontSize: 12 },
})
