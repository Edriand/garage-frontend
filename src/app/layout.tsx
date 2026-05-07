import type { Metadata } from 'next'
import { Noto_Serif, Work_Sans, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { AmplifyProvider } from './AmplifyProvider'
import { AuthProvider } from '@/lib/auth-context'

const notoSerif = Noto_Serif({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-noto-serif',
  display: 'swap',
})

const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-work-sans',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Ruta Mecánica',
  description: 'Tu garaje digital — registra, comparte y celebra la historia de tus coches.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="es"
      className={`${notoSerif.variable} ${workSans.variable} ${spaceGrotesk.variable}`}
    >
      <head>
        {/* Material Symbols for icons */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="bg-background text-on-surface font-body-md antialiased">
        <AmplifyProvider />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
