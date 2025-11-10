import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { customFetchPagination, customFetchStandard } from "../../lib/queryclient/custom-fetch"
import qs from "qs"
import { PaginationParams, SuccessPaginationRes } from "@/lib/queryclient/response.type"

export type Promotion = {
  id: number
  name: string
  description: string
  start_date: string
  end_date: string
  is_active: boolean
}

export const useGetPromotion = (id?: number) => useQuery({
  queryKey: ['promotion', id],
  queryFn: async () => customFetchStandard<Promotion>(`promotion/${id}`),
  enabled: !!id,
})

export const useListPromotion = (params: PaginationParams<{
  is_active?: boolean
}>) =>
  useInfiniteQuery({
    queryKey: ['promotion', 'list', params],
    queryFn: async ({ pageParam }) =>
      customFetchPagination<Promotion>(`catalog/promotion?${qs.stringify(pageParam, { arrayFormat: 'repeat' })}`),
    getNextPageParam: (lastPageRes: SuccessPaginationRes<Promotion>, _, lastPageParam) => {
      if (!lastPageRes.pagination.next_page && !lastPageRes.pagination.next_cursor) return undefined
      return {
        ...lastPageParam,
        page: lastPageRes.pagination.next_page,
        cursor: lastPageRes.pagination.next_cursor,
        limit: lastPageParam.limit,
      }
    },
    initialPageParam: params,
  })