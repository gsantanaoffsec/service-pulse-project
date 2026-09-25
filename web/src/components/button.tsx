import type { ButtonHTMLAttributes } from 'react'
import { getButtonClassName } from './button-styles'
import Icon from './icon'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: string
  icon?: string
  size?: string
}

export default function Button({
  variant = 'primary',
  icon,
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button className={getButtonClassName(variant, size, className)} {...props}>
      {icon && <Icon name={icon} size={18} />}
      {children}
    </button>
  )
}
