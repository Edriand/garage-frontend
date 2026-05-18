import { getPublicPresignedDownloadUrl } from './api'

interface CacheEntry {
  url: string
  expiresAt: number
}

const cache = new Map<string, CacheEntry>()
const inflight = new Map<string, Promise<string | null>>()

export async function resolvePublicPhoto(fileKey: string): Promise<string | null> {
  const now = Date.now()
  const cached = cache.get(fileKey)
  if (cached) {
    if (cached.expiresAt > now) return cached.url
    cache.delete(fileKey)
  }

  if (inflight.has(fileKey)) return inflight.get(fileKey)!

  const p = getPublicPresignedDownloadUrl(fileKey)
    .then(({ downloadUrl, expiresIn }) => {
      cache.set(fileKey, { url: downloadUrl, expiresAt: Date.now() + expiresIn * 1000 })
      inflight.delete(fileKey)
      return downloadUrl
    })
    .catch(() => {
      inflight.delete(fileKey)
      return null
    })

  inflight.set(fileKey, p)
  return p
}
