import type { Metadata } from 'next'
import CarLayoutClient from './CarLayoutClient'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? ''
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://garage.fudex.es'

const defaultMetadata: Metadata = {
  title: 'Ruta Mecánica',
  description: 'Tu garaje digital — registra, comparte y celebra la historia de tus coches.',
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ carId: string }>
}): Promise<Metadata> {
  const { carId } = await params

  try {
    const res = await fetch(`${API_URL}/cars/${carId}`, { next: { revalidate: 3600 } })
    if (!res.ok) return defaultMetadata

    const car = await res.json()
    if (!car.isPublic) return defaultMetadata

    const title = `${car.brand} ${car.model} (${car.year}) — Ruta Mecánica`
    const description = `${car.brand} ${car.model}, ${car.year}`
    const canonical = `${SITE_URL}/cars/${carId}`

    let ogImage: string | undefined
    if (car.photoUrl) {
      try {
        const imgRes = await fetch(
          `${API_URL}/public/download/presigned-url?fileKey=${encodeURIComponent(car.photoUrl)}`,
          { next: { revalidate: 3600 } },
        )
        if (imgRes.ok) {
          const { downloadUrl } = await imgRes.json()
          ogImage = downloadUrl
        }
      } catch { /* no image — use text-only card */ }
    }

    return {
      title,
      description,
      alternates: { canonical },
      openGraph: {
        title,
        description,
        type: 'article',
        url: canonical,
        ...(ogImage && { images: [{ url: ogImage }] }),
      },
      twitter: {
        card: ogImage ? 'summary_large_image' : 'summary',
        title,
        description,
        ...(ogImage && { images: [ogImage] }),
      },
    }
  } catch {
    return defaultMetadata
  }
}

export default function CarLayout({ children }: { children: React.ReactNode }) {
  return <CarLayoutClient>{children}</CarLayoutClient>
}
