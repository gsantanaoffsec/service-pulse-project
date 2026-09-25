export function getButtonClassName(variant = 'primary', size = 'md', className = '') {
  const variants: Record<string, string> = {
    primary: 'bg-primary text-white shadow-button hover:bg-primary-hover',
    secondary: 'border border-border bg-white text-text hover:bg-surface-subtle',
    danger: 'bg-danger text-white shadow-button hover:bg-danger-strong',
    ghost: 'text-text-muted hover:bg-surface-subtle hover:text-text',
  }

  const sizes: Record<string, string> = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-4 text-sm',
    lg: 'h-12 px-5 text-base',
    icon: 'h-10 w-10',
  }

  return `inline-flex shrink-0 items-center justify-center gap-2 rounded-xl font-semibold transition focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary-soft disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`
}
