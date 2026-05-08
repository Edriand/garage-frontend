'use client'

import { useState } from 'react'
import type { FeedCar } from '@/types/api'
import { getFeed } from '@/lib/api'
import { FeedCarCard } from './FeedCarCard'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'

interface RecentSectionProps {
  initialCars: FeedCar[]
  initialNextToken?: string
}

export function RecentSection({ initialCars, initialNextToken }: RecentSectionProps) {
  const [cars, setCars] = useState(initialCars)
  const [nextToken, setNextToken] = useState(initialNextToken)
  const [loading, setLoading] = useState(false)

  async function loadMore() {
    if (!nextToken || loading) return
    setLoading(true)
    try {
      const data = await getFeed({ sort: 'latest', limit: 20, nextToken })
      setCars(prev => [...prev, ...data.cars])
      setNextToken(data.nextToken)
    } catch {
      // silently fail — user can retry
    } finally {
      setLoading(false)
    }
  }

  if (cars.length === 0) {
    return (
      <p className="font-body-sm text-body-sm text-on-surface-variant">
        No hay coches recientes todavía.
      </p>
    )
  }

  return (
    <section className="flex flex-col gap-4">
      {cars.map(car => (
        <FeedCarCard key={car.carId} car={car} variant="list" />
      ))}
      {nextToken && (
        <div className="flex justify-center pt-4">
          <Button variant="secondary" onClick={loadMore} disabled={loading} className="w-full md:w-auto">
            {loading && <Spinner size={16} />}
            CARGAR MÁS
          </Button>
        </div>
      )}
    </section>
  )
}
