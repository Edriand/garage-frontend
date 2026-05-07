const API_URL = process.env.NEXT_PUBLIC_API_URL ?? ''

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })

  if (!res.ok) {
    const body = await res.text().catch(() => res.statusText)
    throw new ApiError(res.status, body)
  }

  return res.json() as Promise<T>
}

export const api = {
  get: <T>(path: string, init?: RequestInit) =>
    request<T>(path, { method: 'GET', ...init }),
  post: <T>(path: string, body: unknown, init?: RequestInit) =>
    request<T>(path, {
      method: 'POST',
      body: JSON.stringify(body),
      ...init,
    }),
  put: <T>(path: string, body: unknown, init?: RequestInit) =>
    request<T>(path, {
      method: 'PUT',
      body: JSON.stringify(body),
      ...init,
    }),
  delete: <T>(path: string, init?: RequestInit) =>
    request<T>(path, { method: 'DELETE', ...init }),
}
