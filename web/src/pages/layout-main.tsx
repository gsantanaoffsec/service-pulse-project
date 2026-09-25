import { Outlet } from 'react-router'
import AppHeader from '../components/app-header'

export default function LayoutMain() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto w-full max-w-content px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <Outlet />
      </main>
      <footer className="mx-auto max-w-content px-4 pb-8 text-center text-xs text-text-soft sm:px-6 lg:px-8">
        ServicePulse · Atendimento interno com contexto e clareza
      </footer>
    </div>
  )
}
