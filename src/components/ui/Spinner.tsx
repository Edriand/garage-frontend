import { SVGAttributes } from 'react'

interface SpinnerProps extends SVGAttributes<SVGElement> {
  size?: number
}

export function Spinner({ size = 24, className = '', ...props }: SpinnerProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={['animate-spin text-primary', className].join(' ')}
      aria-label="Cargando…"
      role="status"
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
        strokeOpacity="0.25"
      />
      <path
        d="M22 12a10 10 0 0 1-10 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}
