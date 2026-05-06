import Link from 'next/link'
import { NAV_LINKS } from '@/lib/nav'

interface BottomNavProps {
  activePath?: string
}

export function BottomNav({ activePath = '/' }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 bg-surface-dim border-t-2 border-outline-variant shadow-[0_-2px_0_0_rgba(107,112,92,0.1)] md:hidden">
      {NAV_LINKS.map(({ href, label, icon }) => {
        const isActive = activePath === href
        return (
          <Link
            key={href}
            href={href}
            className={[
              'flex flex-col items-center justify-center',
              'transition-all active:translate-y-0.5 duration-75',
              isActive
                ? 'bg-secondary-container text-on-secondary-container rounded-xl px-4 py-1 border-b-2 border-on-secondary-container w-20'
                : 'text-on-tertiary-fixed-variant opacity-80 hover:bg-secondary-fixed-dim/20 p-2 rounded-lg w-16',
            ].join(' ')}
          >
            <span
              className="material-symbols-outlined mb-0.5 text-[22px]"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {icon}
            </span>
            <span className="font-label-caps text-[10px]">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
