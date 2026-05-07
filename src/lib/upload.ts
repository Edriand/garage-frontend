import { getPresignedUploadUrl } from '@/lib/api'

export async function uploadFiles(
  files: File[],
  carId: string,
  category: 'photo' | 'document',
): Promise<string[]> {
  const keys: string[] = []
  for (const file of files) {
    const { uploadUrl, fileKey } = await getPresignedUploadUrl({
      carId,
      filename: file.name,
      contentType: file.type,
      category,
    })
    await fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } })
    keys.push(fileKey)
  }
  return keys
}
