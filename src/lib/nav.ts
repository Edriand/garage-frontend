export interface NavLink {
  href: string
  label: string
  icon: string
}

export const NAV_LINKS: NavLink[] = [
  { href: '/garage', label: 'GARAJE', icon: 'garage' },
  { href: '/cars/new', label: 'AÑADIR', icon: 'add_box' },
  { href: '/explore', label: 'EXPLORAR', icon: 'explore' },
  { href: '/profile', label: 'PERFIL', icon: 'person' },
]
