import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'
import { FeedCarCard } from '@/components/feed/FeedCarCard'
import { RecentSection } from '@/components/feed/RecentSection'
import { getFeed } from '@/lib/api'

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full flex items-center gap-4">
      <h3 className="font-label-caps text-label-caps text-on-surface-variant tracking-[0.2em] uppercase whitespace-nowrap">
        {children}
      </h3>
      <div className="flex-grow h-px bg-outline-variant relative">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1.5 h-1.5 bg-surface border border-outline rounded-full" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1.5 h-1.5 bg-surface border border-outline rounded-full" />
      </div>
    </div>
  )
}

export default async function HomePage() {
  const [trending, recent] = await Promise.all([
    getFeed({ sort: 'likes', limit: 6 }).catch(() => ({ cars: [], nextToken: undefined })),
    getFeed({ sort: 'latest', limit: 20 }).catch(() => ({ cars: [], nextToken: undefined })),
  ])

  return (
    <>
      <Header activePath="/" />
      <main className="max-w-[1200px] mx-auto px-5 py-10 pb-24 md:pb-10 flex flex-col gap-10">

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="w-full bg-surface-container-high border border-outline-variant border-t-4 border-t-primary rounded p-4 md:p-6 flex flex-col md:flex-row gap-4 items-center shadow-[4px_4px_0_0_rgba(107,112,92,0.15)] relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{ backgroundImage: 'repeating-linear-gradient(45deg, #535845 0, #535845 1px, transparent 1px, transparent 10px)' }}
          />
          <div className="flex-1 z-10">
            <span className="font-label-caps text-label-caps text-secondary tracking-widest uppercase bg-surface-variant px-2 py-1 rounded-sm border border-outline-variant inline-block mb-2">
              Destacado Semanal
            </span>
            <h2 className="font-display-lg text-headline-md text-on-surface mb-2">
              El Arte de la Restauración
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-4 max-w-md">
              Descubre cómo la comunidad está devolviendo a la vida motores que marcaron una época.
              Explora los garajes más activos.
            </p>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 font-label-caps text-label-caps bg-primary text-on-primary border border-b-4 border-primary-container rounded px-6 py-2 uppercase tracking-[0.1em] shadow-[0_2px_0_0_rgba(83,88,69,0.2)] hover:bg-primary-container active:border-b active:translate-y-px transition-all"
            >
              Explorar Taller
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
          <div className="w-full md:w-[400px] aspect-[4/3] bg-surface-variant border border-outline p-2 rounded-sm shadow-[inset_0_2px_4px_rgba(107,112,92,0.1)] z-10 flex items-center justify-center">
            <span className="material-symbols-outlined text-[64px] text-on-surface-variant opacity-20">garage</span>
          </div>
        </section>

        {/* ── Tendencias ───────────────────────────────────────────────── */}
        <SectionLabel>TENDENCIAS EN EL GARAJE</SectionLabel>
        <section className="w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-5 px-5 md:mx-0 md:px-0 pb-2">
          <div className="flex gap-4 md:grid md:grid-cols-3 md:gap-6 w-max md:w-full">
            {trending.cars.length > 0
              ? trending.cars.map(car => <FeedCarCard key={car.carId} car={car} variant="grid" />)
              : (
                <p className="font-body-sm text-body-sm text-on-surface-variant md:col-span-3">
                  No hay coches en tendencia todavía.
                </p>
              )
            }
          </div>
        </section>

        {/* ── Recién llegados ───────────────────────────────────────────── */}
        <SectionLabel>RECIÉN LLEGADOS</SectionLabel>
        <RecentSection initialCars={recent.cars} initialNextToken={recent.nextToken} />

      </main>
      <BottomNav activePath="/" />
    </>
  )
}
