import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

import { colors } from '@/theme/colors'

export default function Layout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }} />
    </>
  )
}
