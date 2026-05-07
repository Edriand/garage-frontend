import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, id, className = '', ...props },
  ref,
) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={inputId}
          className="font-label-caps text-label-caps text-on-surface-variant"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        suppressHydrationWarning
        className={[
          'bg-surface-container-low text-on-surface',
          'border border-outline-variant rounded px-3 py-2',
          'shadow-[inset_0_2px_4px_rgba(107,112,92,0.12)]',
          'placeholder:text-on-surface-variant/50',
          'focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary',
          'transition-all duration-100',
          error ? 'border-error focus:ring-error/40' : '',
          className,
        ].join(' ')}
        {...props}
      />
      {error && (
        <p className="font-body-sm text-body-sm text-error">{error}</p>
      )}
    </div>
  )
})
