import { HTMLAttributes } from 'react'

type EventType = 'mechanic' | 'fuel' | 'wash' | 'insurance' | 'other'

const eventColors: Record<EventType, string> = {
  mechanic: 'bg-primary-container text-on-primary-container',
  fuel: 'bg-secondary-container text-on-secondary-container',
  wash: 'bg-surface-container-high text-on-surface',
  insurance: 'bg-outline-variant text-on-surface',
  other: 'bg-surface-dim text-on-surface',
}

const eventLabels: Record<EventType, string> = {
  mechanic: 'TALLER',
  fuel: 'REPOSTAJE',
  wash: 'LAVADO',
  insurance: 'SEGURO',
  other: 'OTRO',
}

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  eventType?: EventType
  variant?: 'default' | 'outline'
}

export function Badge({
  eventType,
  variant = 'default',
  className = '',
  children,
  ...props
}: BadgeProps) {
  const colorClass = eventType ? eventColors[eventType] : ''
  const defaultClass =
    variant === 'outline'
      ? 'bg-transparent border border-outline-variant text-on-surface-variant'
      : 'bg-surface-container text-on-surface'

  return (
    <span
      className={[
        'inline-flex items-center',
        'font-label-caps text-[10px] tracking-widest',
        'px-2 py-0.5 rounded-sm',
        'border border-transparent',
        eventType ? colorClass : defaultClass,
        className,
      ].join(' ')}
      {...props}
    >
      {eventType ? eventLabels[eventType] : children}
    </span>
  )
}
