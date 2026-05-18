import { getPublicPresignedDownloadUrl } from './api'

interface CacheEntry {
  url: string
  expiresAt: number
}

const cache = new Map<string, CacheEntry>()

export async function resolvePublicPhoto(fileKey: string): Promise<string | null> {
  const now = Date.now()
  const cached = cache.get(fileKey)
  if (cached && cached.expiresAt > now) return cached.url

  try {
    const { downloadUrl, expiresIn } = await getPublicPresignedDownloadUrl(fileKey)
    cache.set(fileKey, { url: downloadUrl, expiresAt: now + expiresIn * 1000 })
    return downloadUrl
  } catch {
    return null
  }
}
