import { useLocalSearchParams } from 'expo-router'

import { TicketForm } from '@/pages/TicketForm'

export default function EditTicket() {
  const { idticket } = useLocalSearchParams<{ idticket: string }>()

  return <TicketForm mode="edit" idticket={idticket} />
}
