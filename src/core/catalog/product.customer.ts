import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"
import { getQueryClient } from "../../lib/queryclient/query-client"
import { customFetchPagination, customFetchStandard } from "../../lib/queryclient/custom-fetch"
import qs from "qs"
import { PaginationParams } from "../../lib/queryclient/response.type"
import { Resource } from "../common/resource.type"
import { CartItem } from "../account/cart"

export type TProductDetail = {
  id: number
  code: string
  vendor_id: number
  name: string
  description: string
  resources: Resource[]
  brand: string
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
    attributes: { name: string; value: string }[]
  }[]
  specifications: { name: string; value: string }[]
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
  resources: Resource[]
  promo?: {
    id: string
    title: string
    description: string
  }
}

export const useListProductCards = (params: PaginationParams<{
  search: string
  vendor_id?: number
  category?: string
  min_price?: number
  max_price?: number
  sort?: 'relevance' | 'price-low' | 'price-high' | 'rating' | 'newest'
}>) =>
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


export const useListProductCardsRecommended = (params: { limit: number }) =>
  useInfiniteQuery({
    queryKey: ['product', 'cards', 'recommended', params],
    queryFn: async ({ pageParam }) => customFetchPagination<TProductCard>(`catalog/product-card/recommended?${qs.stringify(pageParam)}`),
    getNextPageParam: (lastPageRes, _, lastPageParam) => {
      // if (!lastPageRes.pagination.next_page && !lastPageRes.pagination.next_cursor) return undefined
      return {
        ...lastPageParam,
        // page: lastPageRes.pagination.next_page,
        // cursor: lastPageRes.pagination.next_cursor,
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

