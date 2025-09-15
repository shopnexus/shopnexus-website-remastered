import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"
import { getQueryClient } from "../../lib/queryclient/query-client"
import { customFetchPagination, customFetchStandard } from "../../lib/queryclient/custom-fetch"
import qs from "qs"
import { PaginationParams } from "../../lib/queryclient/response.type"

const queryClient = getQueryClient()

export type TProductDetail = {
  id: number
	name: string
	description: string
	resources: {
		id: number
		mime: string
		url: string
		file_size: number
		width: number
		height: number
		duration: number
	}[]
	category: string
	rating: {
		score: number
		total: number
		breakdown: Record<string, number>
	}
	sold: number
	promo_id?: number
	skus: {
		id: number
    price: number
		original_price: number
		attributes: Record<string, string>
	}[]
	specifications: Record<string, string>
}

export type TProductCard = {
  id: string
  code: string
  vendor_id: number
  category_id: number
  brand_id: number
  name: string
  description: string
  is_active: boolean
  date_manufactured: string
  date_created: string
  date_updated: string
  date_deleted: string | null
  applied_promotion_id: number
  price: number
  original_price: number
  rating: {
    score: number
    total: number
  }
  image: string
  promo?: {
    id: string
    title: string
    description: string
  }
}

export type ListProductCardsParams = PaginationParams<{
  name: string
}>

export const useListProductCards = (params: ListProductCardsParams) =>
  useInfiniteQuery({
    queryKey: ['product', 'cards', params],
    queryFn: async ({ pageParam }) => customFetchPagination<TProductCard>(`catalog/product-card?${qs.stringify(pageParam)}`),
    getNextPageParam: (lastPageRes, _, lastPageParam) => {
      if (!lastPageRes.pagination.next_page && !lastPageRes.pagination.next_cursor) {
        return undefined
      }

      return {
        ...lastPageParam,
        page: lastPageRes.pagination.next_page,
        cursor: lastPageRes.pagination.next_cursor,
        limit: lastPageParam.limit,
      }
    },
    initialPageParam: params,
  })



export const useGetProductDetail = (id: string) =>
  useQuery({
    queryKey: ['product', 'detail', id],
    queryFn: () => customFetchStandard<TProductDetail>(`catalog/product-detail?id=${id}`),
  })