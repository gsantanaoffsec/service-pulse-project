import { Link } from 'react-router'
import Icon from './icon'

interface PageHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  backTo?: string
  actions?: React.ReactNode
}

export default function PageHeader({
  eyebrow,
  title,
  description,
  backTo,
  actions,
}: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        {backTo && (
          <Link
            aria-label="Voltar"
            className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border bg-white text-text-muted transition hover:bg-surface-subtle hover:text-text"
            to={backTo}
          >
            <Icon name="arrowLeft" />
          </Link>
        )}

        <div className="min-w-0">
          {eyebrow && (
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              {eyebrow}
            </p>
          )}
          <h1 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">{title}</h1>
          {description && (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-text-muted">{description}</p>
          )}
        </div>
      </div>

      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  )
}
