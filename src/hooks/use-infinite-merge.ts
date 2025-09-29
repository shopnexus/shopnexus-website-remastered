import { SuccessPaginationRes } from '@/lib/queryclient/response.type'
import { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query'
import { useMemo } from 'react'

export function useInfiniteMerge<Entity, TPageParams = unknown, TError = Error>(
  infiniteResult: UseInfiniteQueryResult<
    InfiniteData<SuccessPaginationRes<Entity>, TPageParams>,
    TError
  >,
) {
  const items = useMemo(
    () => infiniteResult?.data?.pages.flatMap(page => page.data) ?? [],
    [infiniteResult?.data?.pages],
  )

  return items
}