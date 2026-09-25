import { Modal, Pressable, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import { colors } from '@/theme/colors'

import { styles } from './styles'

interface ConfirmModalProps {
  visible: boolean
  title: string
  description: string
  onCancel: () => void
  onConfirm?: () => void
  confirmDisabled?: boolean
  isLoading?: boolean
  error?: string
}

export function ConfirmModal({
  visible,
  title,
  description,
  onCancel,
  onConfirm,
  confirmDisabled = false,
  isLoading = false,
  error = '',
}: ConfirmModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.icon}>
            <Ionicons name="trash-outline" size={24} color={colors.danger} />
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <View style={styles.actions}>
            <Pressable style={styles.cancel} onPress={onCancel} disabled={isLoading}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </Pressable>
            <Pressable
              style={[styles.confirm, (confirmDisabled || isLoading) && styles.disabled]}
              onPress={onConfirm}
              disabled={confirmDisabled || isLoading}
            >
              <Text style={styles.confirmText}>{isLoading ? 'Excluindo...' : 'Excluir'}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}
