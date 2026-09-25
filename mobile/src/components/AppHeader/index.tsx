import { View, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import { colors } from '@/theme/colors'

import { styles } from './styles'

export function AppHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.identity}>
        <View style={styles.logo}>
          <Ionicons name="pulse" size={22} color={colors.white} />
        </View>
        <View>
          <Text style={styles.title}>ServicePulse</Text>
          <Text style={styles.subtitle}>Central de chamados</Text>
        </View>
      </View>
      <View style={styles.user}>
        <Text style={styles.userText}>Usuário</Text>
      </View>
    </View>
  )
}
