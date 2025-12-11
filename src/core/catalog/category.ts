import { customFetchPagination, customFetchStandard } from "@/lib/queryclient/custom-fetch"
import { PaginationParams, SuccessPaginationRes } from "@/lib/queryclient/response.type"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import QueryString from "qs"

export type Category = {
  id: number
  name: string
  description: string
}

export const useListCategories = (params: PaginationParams<{
  search?: string
}>) =>
  useInfiniteQuery({
    queryKey: ['category', 'list', params],
    queryFn: async ({ pageParam }) =>
      customFetchPagination<Category>(`catalog/category?${QueryString.stringify(pageParam)}`),
    getNextPageParam: (lastPageRes: SuccessPaginationRes<Category>, _, lastPageParam) => {
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



export const useGetCategory = (id: number) =>
  useQuery({
    queryKey: ['category', 'detail', id],
    queryFn: () => customFetchStandard<Category>(`catalog/category/${id}`),
    enabled: typeof id === 'number' && id > 0,
  })