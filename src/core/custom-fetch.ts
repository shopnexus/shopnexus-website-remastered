import { SuccessPaginationRes, SuccessResponse, TErrorResponse } from './response.type'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api'

const headers: Record<string, string> = {
  'Content-Type': 'application/json',
}

if (process.env.NODE_ENV === 'development' && globalThis?.localStorage && process.env.NEXT_PUBLIC_TOKEN?.length) {
  console.warn(`Development mode: Using local storage token ${process.env.NEXT_PUBLIC_TOKEN}`)
  globalThis?.localStorage?.setItem?.('token', process.env.NEXT_PUBLIC_TOKEN ?? '')
}

export async function customFetch<TResponse = any>(
  url: string,
  options: RequestInit = {},
) {
  const token = globalThis?.localStorage?.getItem?.('token')
  if (token?.length) {
    headers.Authorization = `Bearer ${token}`
    console.log('Using token from local storage:', token)
  }

  const resolvedUrl = resolveUrl(BASE_URL, url)
  const response = await fetch(resolvedUrl, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  })

  const data = await response.json()

  if (!response.ok || data?.error?.code) {
    const res = data as TErrorResponse
    throw new Error(res.error.message)
  }

  return data as Promise<TResponse>
}

export async function customFetchStandard<Data = any>(
  url: string,
  options: RequestInit = {},
) {
  const response = await customFetch<SuccessResponse<Data>>(url, options)
  return response.data
}

export async function customFetchPagination<Data = any>(
  url: string,
  options: RequestInit = {},
) {
  return customFetch<SuccessPaginationRes<Data>>(url, options)
}

// Helper function to resolve URLs
function resolveUrl(base: string, path: string): string {
  return new URL(path, base).toString()
}
