'use client'

import { useState } from 'react'
import type { FeedCar } from '@/types/api'
import { getFeed } from '@/lib/api'
import { FeedCarCard } from '@/components/feed/FeedCarCard'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'

interface ExploreClientProps {
  initialCars: FeedCar[]
  initialNextToken?: string
  initialSort: 'latest' | 'likes'
}

export function ExploreClient({ initialCars, initialNextToken, initialSort }: ExploreClientProps) {
  const [sort, setSort] = useState<'latest' | 'likes'>(initialSort)
  const [cars, setCars] = useState(initialCars)
  const [nextToken, setNextToken] = useState(initialNextToken)
  const [loading, setLoading] = useState(false)
  const [sortLoading, setSortLoading] = useState(false)

  async function handleSortChange(newSort: 'latest' | 'likes') {
    if (newSort === sort || sortLoading) return
    setSortLoading(true)
    try {
      const data = await getFeed({ sort: newSort })
      setSort(newSort)
      setCars(data.cars)
      setNextToken(data.nextToken)
    } catch {
      // silently fail
    } finally {
      setSortLoading(false)
    }
  }

  async function loadMore() {
    if (!nextToken || loading) return
    setLoading(true)
    try {
      const data = await getFeed({ sort, nextToken })
      setCars(prev => [...prev, ...data.cars])
      setNextToken(data.nextToken)
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Sort toggle */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="font-label-caps text-label-caps text-on-surface-variant">ORDENAR:</span>
        <button
          onClick={() => handleSortChange('latest')}
          disabled={sortLoading}
          className={[
            'font-label-caps text-label-caps px-3 py-1.5 rounded border transition-all disabled:opacity-50',
            sort === 'latest'
              ? 'bg-primary text-on-primary border-primary-container border-b-4 shadow-[0_2px_0_0_rgba(83,88,69,0.2)]'
              : 'bg-surface-container text-on-surface-variant border-outline-variant hover:bg-surface-container-high',
          ].join(' ')}
        >
          RECIENTES
        </button>
        <button
          onClick={() => handleSortChange('likes')}
          disabled={sortLoading}
          className={[
            'font-label-caps text-label-caps px-3 py-1.5 rounded border transition-all disabled:opacity-50',
            sort === 'likes'
              ? 'bg-primary text-on-primary border-primary-container border-b-4 shadow-[0_2px_0_0_rgba(83,88,69,0.2)]'
              : 'bg-surface-container text-on-surface-variant border-outline-variant hover:bg-surface-container-high',
          ].join(' ')}
        >
          TENDENCIAS
        </button>
        {sortLoading && <Spinner size={16} />}
      </div>

      {/* Grid */}
      {cars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {cars.map(car => (
            <FeedCarCard key={car.carId} car={car} variant="grid" />
          ))}
        </div>
      ) : (
        <p className="font-body-sm text-body-sm text-on-surface-variant text-center py-12">
          No hay coches públicos todavía.
        </p>
      )}

      {/* Load more */}
      {nextToken && (
        <div className="flex justify-center pt-4">
          <Button variant="secondary" onClick={loadMore} disabled={loading} className="w-full md:w-auto">
            {loading && <Spinner size={16} />}
            CARGAR MÁS REGISTROS
          </Button>
        </div>
      )}
    </div>
  )
}
