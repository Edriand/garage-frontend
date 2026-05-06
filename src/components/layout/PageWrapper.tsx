import { HTMLAttributes } from 'react'

interface PageWrapperProps extends HTMLAttributes<HTMLDivElement> {
  as?: 'div' | 'main' | 'section'
}

export function PageWrapper({
  as: Tag = 'main',
  className = '',
  children,
  ...props
}: PageWrapperProps) {
  return (
    <Tag
      className={[
        'max-w-[1200px] mx-auto',
        'px-5 py-10',
        /* Bottom padding to avoid overlap with mobile BottomNav */
        'pb-24 md:pb-10',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </Tag>
  )
}
