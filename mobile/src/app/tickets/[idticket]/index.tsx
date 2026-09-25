import { useLocalSearchParams } from 'expo-router'

import { TicketDetails } from '@/pages/TicketDetails'

export default function Ticket() {
  const { idticket } = useLocalSearchParams<{ idticket: string }>()

  return <TicketDetails idticket={idticket} />
}
