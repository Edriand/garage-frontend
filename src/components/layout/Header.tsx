import Link from 'next/link'

const navLinks = [
  { href: '/', label: 'INICIO', icon: 'home_storage' },
  { href: '/garage', label: 'GARAJE', icon: 'garage' },
  { href: '/cars/new', label: 'AÑADIR', icon: 'add_box' },
  { href: '/explore', label: 'EXPLORAR', icon: 'explore' },
  { href: '/profile', label: 'PERFIL', icon: 'person' },
]

interface HeaderProps {
  activePath?: string
}

export function Header({ activePath = '/' }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-surface-container border-b-2 border-outline-variant shadow-[0_2px_0_0_rgba(107,112,92,0.15)]">
      <div className="flex justify-between items-center w-full px-5 py-2 max-w-[1200px] mx-auto">
        {/* Placeholder for menu / back button */}
        <div className="w-10 h-10" />
        {/* Logo */}
        <Link
          href="/"
          className="font-display-lg text-title-sm font-bold text-on-surface tracking-[0.2em] uppercase"
        >
          RUTA MECÁNICA
        </Link>
        {/* Avatar placeholder */}
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-outline-variant bg-surface-dim" />
      </div>

      {/* Desktop nav — hidden on mobile */}
      <nav className="hidden md:block w-full bg-surface-container-highest border-t border-outline-variant/50">
        <ul className="flex justify-center items-center gap-10 max-w-[1200px] mx-auto px-5 h-12">
          {navLinks.map(({ href, label, icon }) => {
            const isActive = activePath === href
            return (
              <li
                key={href}
                className={isActive ? 'h-full flex items-center border-b-2 border-primary' : ''}
              >
                <Link
                  href={href}
                  className={[
                    'font-label-caps text-label-caps flex items-center gap-1',
                    isActive
                      ? 'text-primary'
                      : 'text-on-surface-variant hover:text-primary transition-colors',
                  ].join(' ')}
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {icon}
                  </span>
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}
