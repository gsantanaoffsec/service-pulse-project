import { Link } from 'react-router'
import Icon from './icon'

export default function AppHeader() {
  return (
    <header className="border-b border-border/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-content items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link className="flex items-center gap-3" to="/">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-white shadow-button">
            <Icon name="activity" size={21} />
          </span>
          <span>
            <span className="block text-base font-semibold tracking-tight text-text">
              ServicePulse
            </span>
            <span className="hidden text-xs text-text-muted sm:block">Central de chamados</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="hidden rounded-full border border-border bg-surface-subtle px-3 py-1.5 text-xs font-medium text-text-muted sm:inline-flex">
            Ambiente interno
          </span>
          <span className="inline-flex h-9 items-center rounded-full bg-primary-soft px-3 text-sm font-semibold text-primary">
            Usuário
          </span>
        </div>
      </div>
    </header>
  )
}
