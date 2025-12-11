import { customFetchPagination, customFetchStandard } from "@/lib/queryclient/custom-fetch"
import { PaginationParams, SuccessPaginationRes } from "@/lib/queryclient/response.type"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import QueryString from "qs"

export type Brand = {
  id: number
  code: string
  name: string
  description: string
}

export const useListBrands = (params: PaginationParams<{
  search?: string
}>) =>
  useInfiniteQuery({
    queryKey: ['brand', 'list', params],
    queryFn: async ({ pageParam }) =>
      customFetchPagination<Brand>(`catalog/brand?${QueryString.stringify(pageParam)}`),
    getNextPageParam: (lastPageRes: SuccessPaginationRes<Brand>, _, lastPageParam) => {
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

export const useGetBrand = (id: number) =>
  useQuery({
    queryKey: ['brand', 'detail', id],
    queryFn: () => customFetchStandard<Brand>(`catalog/brand/${id}`),
    enabled: typeof id === 'number' && id > 0,
  })