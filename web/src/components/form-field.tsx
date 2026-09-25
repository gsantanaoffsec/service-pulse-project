import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

interface FieldProps {
  label: string
  htmlFor: string
  hint?: string
  children: React.ReactNode
  className?: string
}

export const controlClassName =
  'w-full rounded-xl border border-border bg-white px-3.5 text-[15px] text-text outline-none transition placeholder:text-text-soft focus:border-primary focus:ring-3 focus:ring-primary-soft disabled:cursor-not-allowed disabled:bg-surface-subtle disabled:text-text-muted'

export function Field({ label, htmlFor, hint, children, className = '' }: FieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-baseline justify-between gap-3">
        <label className="text-sm font-semibold text-text" htmlFor={htmlFor}>
          {label}
        </label>
        {hint && <span className="text-xs text-text-muted">{hint}</span>}
      </div>
      {children}
    </div>
  )
}

export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${controlClassName} h-11 ${className}`} {...props} />
}

export function Select({
  className = '',
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={`${controlClassName} h-11 appearance-none ${className}`} {...props}>
      {children}
    </select>
  )
}

export function Textarea({
  className = '',
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea className={`${controlClassName} min-h-32 resize-y py-3 ${className}`} {...props} />
  )
}
