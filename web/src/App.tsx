import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import LayoutMain from './pages/layout-main'
import PageActivityForm from './pages/page-activity-form'
import PageTicketDetails from './pages/page-ticket-details'
import PageTicketForm from './pages/page-ticket-form'
import PageTickets from './pages/page-tickets'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LayoutMain />}>
          <Route index element={<PageTickets />} />
          <Route path="/tickets/new" element={<PageTicketForm />} />
          <Route path="/tickets/:idticket" element={<PageTicketDetails />} />
          <Route path="/tickets/:idticket/edit" element={<PageTicketForm />} />
          <Route path="/tickets/:idticket/activities/new" element={<PageActivityForm />} />
          <Route
            path="/tickets/:idticket/activities/:idactivity/edit"
            element={<PageActivityForm />}
          />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
