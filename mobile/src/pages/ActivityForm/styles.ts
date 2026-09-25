import { StyleSheet } from 'react-native'

import { colors } from '@/theme/colors'

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 18, paddingBottom: 42, gap: 8 },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    marginBottom: 12,
  },
  backText: { color: colors.primary, fontWeight: '700', fontSize: 14 },
  eyebrow: { color: colors.primary, fontWeight: '800', fontSize: 11, letterSpacing: 2 },
  heading: { color: colors.text, fontWeight: '800', fontSize: 28 },
  subheading: { color: colors.muted, fontSize: 14, marginBottom: 16, lineHeight: 21 },
  form: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 17,
    gap: 16,
  },
  actions: { flexDirection: 'row', gap: 10, marginTop: 20 },
  cancelButton: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  cancelText: { color: colors.text, fontWeight: '700' },
  saveButton: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  saveText: { color: colors.white, fontWeight: '700' },
  disabled: { opacity: 0.5 },
  listState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadError: { color: colors.danger, fontSize: 14, textAlign: 'center', padding: 24 },
  saveError: { color: colors.danger, fontSize: 13, lineHeight: 19, marginTop: 12 },
  retryButton: {
    alignSelf: 'center',
    backgroundColor: colors.primary,
    borderRadius: 11,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  retryText: { color: colors.white, fontWeight: '700' },
})
