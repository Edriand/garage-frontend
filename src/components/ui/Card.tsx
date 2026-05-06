import { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: 'div' | 'article' | 'section'
}

export function Card({
  as: Tag = 'div',
  className = '',
  children,
  ...props
}: CardProps) {
  return (
    <Tag
      className={[
        'relative bg-surface-container-lowest',
        'border border-outline-variant rounded-lg overflow-hidden',
        'shadow-[0_2px_0_0_rgba(107,112,92,0.15)]',
        className,
      ].join(' ')}
      {...props}
    >
      {/* Dashed top separator — evokes maintenance record / coupon */}
      <div className="absolute top-0 left-0 w-full h-0 border-t-2 border-dashed border-outline-variant/50" />
      <div className="pt-[2px]">{children}</div>
    </Tag>
  )
}

export function CardBody({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={['p-4', className].join(' ')} {...props}>
      {children}
    </div>
  )
}
