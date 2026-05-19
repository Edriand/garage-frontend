'use client'

import { useParams } from 'next/navigation'
import { EventsPanel } from '../EventsPanel'

export default function EventsPage() {
  const { carId } = useParams<{ carId: string }>()
  return <EventsPanel carId={carId} />
}
