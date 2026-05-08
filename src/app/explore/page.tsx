import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'
import { ExploreClient } from './ExploreClient'
import { getFeed } from '@/lib/api'

export default async function ExplorePage() {
  const initial = await getFeed({ sort: 'latest' }).catch(() => ({ cars: [], nextToken: undefined }))

  return (
    <>
      <Header activePath="/explore" />
      <main className="max-w-[1200px] mx-auto px-5 py-10 pb-24 md:pb-10">
        <div className="flex items-end justify-between gap-4 mb-8 pb-4 border-b-2 border-outline-variant">
          <div>
            <h1 className="font-headline-md text-headline-md text-on-surface">Explorar Garajes</h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              Descubre los proyectos más destacados de la comunidad.
            </p>
          </div>
        </div>

        <ExploreClient
          initialCars={initial.cars}
          initialNextToken={initial.nextToken}
          initialSort="latest"
        />
      </main>
      <BottomNav activePath="/explore" />
    </>
  )
}
