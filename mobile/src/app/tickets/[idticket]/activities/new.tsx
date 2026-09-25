import { useLocalSearchParams } from 'expo-router'

import { ActivityForm } from '@/pages/ActivityForm'

export default function NewActivity() {
  const { idticket } = useLocalSearchParams<{ idticket: string }>()

  return <ActivityForm mode="create" idticket={idticket} />
}
