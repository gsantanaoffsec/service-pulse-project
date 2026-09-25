import { Text, TextInput, View } from 'react-native'

import { colors } from '@/theme/colors'

import { styles } from './styles'

interface FormFieldProps {
  label: string
  value: string
  onChangeText?: (text: string) => void
  placeholder?: string
  multiline?: boolean
  keyboardType?: 'default' | 'numeric'
  editable?: boolean
}

export function FormField({ label, value, onChangeText, placeholder, multiline, keyboardType = 'default', editable = true }: FormFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.multiline, !editable && styles.readonly]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.soft}
        multiline={multiline}
        keyboardType={keyboardType}
        editable={editable}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    </View>
  )
}
