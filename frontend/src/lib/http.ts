const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const msg = await res.text()
    throw new Error(`HTTP ${res.status}: ${msg}`)
  }
  return res.json() as Promise<T>
}
