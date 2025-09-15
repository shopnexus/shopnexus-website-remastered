import React from 'react'
import {
  type InfiniteData,
  type UseInfiniteQueryResult,
} from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'
import { SuccessPaginationRes } from '@/lib/queryclient/response.type'

export function useInfiniteScroll<Entity, TPageParams = unknown, TError = Error>(
  infiniteResult: UseInfiniteQueryResult<
    InfiniteData<SuccessPaginationRes<Entity>, TPageParams>,
    TError
  >,
  maxEstimate?: number,
  initialEstimate = 1,
) {
  const {
    data = {
      pages: [],
      pageParams: [],
    },
    hasNextPage,
    fetchNextPage,
    isPending,
    isFetching,
    isLoading,
    error,
  } = infiniteResult
  const { ref, inView } = useInView()

  const items = React.useMemo(
    () => data.pages.flatMap(page => page.data) ?? [],
    [data.pages],
  )

  const currentAmount = React.useMemo(
    () => data.pages.reduce((acc, page) => acc + page.data.length, 0) ?? 0,
    [data.pages],
  )

  const estimate = React.useMemo(() => {
    if (!data.pages?.length) {
      return initialEstimate ?? maxEstimate ?? 1
    }

    const lastPage = data.pages[data.pages.length - 1]
    const { total = currentAmount, limit = 10 } = lastPage.pagination

    const currentEstimate = maxEstimate ?? limit

    return Math.min(total - currentAmount, currentEstimate)
  }, [currentAmount, data, maxEstimate])

  React.useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, inView, isFetching])

  return {
    ref,
    items,
    currentAmount,
    estimate,
    isFetching,
    isPending,
    isLoading,
    error,
  }
}