import { InfiniteData } from '@tanstack/react-query'
import { useMemo } from 'react'

type ListData<T> = {
  data: T[]
}

export function useInfiniteMerge<T>(
  data: InfiniteData<ListData<T>> | undefined,
) {
  const items = useMemo(
    () => data?.pages.flatMap(page => page.data) ?? [],
    [data?.pages],
  )

  return items
}