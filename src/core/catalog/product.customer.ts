import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { customFetchStandard } from "@/lib/queryclient/custom-fetch"
import { useInfiniteQueryPagination } from "@/lib/queryclient/use-infinite-query"
import qs from "qs"
import { PaginationParams, SuccessPaginationRes, SuccessResponse } from "@/lib/queryclient/response.type"
import { Resource } from "../common/resource.type"

// ===== Types =====

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

// ===== Hooks =====

export const useListProductCards = (
  params: PaginationParams<{
    search?: string
    vendor_id?: string
  }>,
  options?: {
    enabled?: boolean
    staleTime?: number
    gcTime?: number
    refetchOnWindowFocus?: boolean
    refetchOnMount?: boolean
    refetchOnReconnect?: boolean
    retry?: number | boolean
    retryDelay?: number | ((attemptIndex: number) => number)
  }
) =>
  useInfiniteQueryPagination<TProductCard>(
    ['product', 'cards'],
    'catalog/product-card',
    params,
    options
  )

export const useListProductCardsRecommended = (params: { limit?: number }) =>
  useQuery({
    queryKey: ['product', 'cards', 'recommended', params],
    queryFn: async () => customFetchStandard<TProductCard[]>(`catalog/product-card/recommended?${qs.stringify(params)}`),
  })

export const useGetProductDetail = (id: string) =>
  useQuery({
    queryKey: ['product', 'detail', id],
    queryFn: () => customFetchStandard<TProductDetail>(`catalog/product-detail?id=${id}`),
  })


