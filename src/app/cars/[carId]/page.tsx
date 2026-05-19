'use client'

import { useParams } from 'next/navigation'
import { CarResumenPanel } from './CarResumenPanel'

export default function CarResumenPage() {
  const { carId } = useParams<{ carId: string }>()
  return <CarResumenPanel carId={carId} />
}
