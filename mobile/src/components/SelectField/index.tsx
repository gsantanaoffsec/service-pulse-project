import { useState } from 'react'
import { Modal, Pressable, ScrollView, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import { colors } from '@/theme/colors'

import { styles } from './styles'

interface SelectOption {
  label: string
  value: string
}

interface SelectFieldProps {
  label: string
  value: string
  options: SelectOption[]
  onChange: (value: string) => void
}

export function SelectField({ label, value, options, onChange }: SelectFieldProps) {
  const [isOpen, setIsOpen] = useState(false)
  const selected = options.find((option) => option.value === value)

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={styles.select} onPress={() => setIsOpen(true)}>
        <Text style={[styles.value, !selected && styles.placeholder]}>{selected?.label ?? 'Selecione'}</Text>
        <Ionicons name="chevron-down" size={18} color={colors.muted} />
      </Pressable>
      <Modal visible={isOpen} transparent animationType="fade" onRequestClose={() => setIsOpen(false)}>
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>{label}</Text>
            <ScrollView>
              {options.map((option) => (
                <Pressable
                  key={option.value}
                  style={styles.option}
                  onPress={() => {
                    onChange(option.value)
                    setIsOpen(false)
                  }}
                >
                  <Text style={[styles.optionText, value === option.value && styles.active]}>{option.label}</Text>
                  {value === option.value && <Ionicons name="checkmark" size={18} color={colors.primary} />}
                </Pressable>
              ))}
            </ScrollView>
            <Pressable style={styles.cancel} onPress={() => setIsOpen(false)}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  )
}
