import { useLocalSearchParams } from 'expo-router'

import { ActivityForm } from '@/pages/ActivityForm'

export default function EditActivity() {
  const { idticket, idactivity } = useLocalSearchParams<{ idticket: string; idactivity: string }>()

  return <ActivityForm mode="edit" idticket={idticket} idactivity={idactivity} />
}
