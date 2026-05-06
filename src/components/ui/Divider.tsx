import { HTMLAttributes } from 'react'

interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  label?: string
}

export function Divider({ label, className = '', ...props }: DividerProps) {
  return (
    <div
      className={['relative flex items-center w-full', className].join(' ')}
      {...props}
    >
      <div className="flex-1 h-px bg-outline-variant" />
      {/* Metal rivet detail */}
      <div className="relative z-10 mx-2 flex items-center justify-center">
        {label ? (
          <span className="font-label-caps text-label-caps text-outline px-2 bg-surface-container-low">
            {label}
          </span>
        ) : (
          <div className="w-2 h-2 bg-surface-container-low border border-outline-variant rotate-45" />
        )}
      </div>
      <div className="flex-1 h-px bg-outline-variant" />
    </div>
  )
}
