import { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

const variants: Record<Variant, string> = {
  primary: [
    'bg-gradient-to-b from-primary to-primary-container',
    'text-on-primary border-primary-container',
    'border border-b-4',
    'shadow-[0_2px_0_0_rgba(83,88,69,0.2)]',
    'hover:from-primary-container hover:to-primary',
    'active:border-b active:translate-y-px active:shadow-none',
  ].join(' '),
  secondary: [
    'bg-gradient-to-b from-surface-container to-surface-container-high',
    'text-on-surface border-outline-variant',
    'border border-b-4',
    'shadow-[0_2px_0_0_rgba(107,112,92,0.15)]',
    'hover:from-surface-container-high hover:to-surface-dim',
    'active:border-b active:translate-y-px active:shadow-none',
  ].join(' '),
  ghost: [
    'bg-transparent text-primary',
    'hover:bg-surface-container-low',
    'active:bg-surface-container',
  ].join(' '),
}

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        'inline-flex items-center justify-center gap-2',
        'font-label-caps text-label-caps',
        'px-4 py-2 rounded',
        'transition-all duration-75 cursor-pointer',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  )
}
