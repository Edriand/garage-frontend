import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'
import { PageWrapper } from '@/components/layout/PageWrapper'

export default function Home() {
  return (
    <>
      <Header activePath="/" />
      <PageWrapper>
        <h1 className="font-display-lg text-display-lg text-on-surface">
          Ruta Mecánica
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-4">
          Bienvenido a tu garaje digital.
        </p>
      </PageWrapper>
      <BottomNav activePath="/" />
    </>
  )
}
