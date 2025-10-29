import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query"
import { customFetchStandard, customFetchPagination } from "../../lib/queryclient/custom-fetch"
import { PaginationParams } from "../../lib/queryclient/response.type"
import qs from "qs"

// Types for inventory management
export interface Serial {
  id: number
  serial_id: string
  sku_id: number
  status: "Active" | "Inactive" | "Sold" | "Damaged"
  date_created: string
}

export interface Stock {
  id: number
  ref_type: "ProductSku" | "Promotion"
  ref_id: number
  current_stock: number
  sold: number
  date_created: string
}

export interface StockHistory {
  id: number
  stock_id: number
  change: number
  date_created: string
}

// Query functions
export function useGetStock(params: {
  ref_id: number
  ref_type: "ProductSku" | "Promotion"
}) {
  return useQuery({
    queryKey: ["inventory", "stock", params],
    queryFn: () => customFetchStandard<Stock>(`inventory/stock?${qs.stringify(params)}`),
    enabled: !!params.ref_id && !!params.ref_type,
  })
}

export function useListStockHistory(params: PaginationParams<{
  ref_id: number
  ref_type: "ProductSku" | "Promotion"
}>) {
  return useInfiniteQuery({
    queryKey: ["inventory", "stock-history", params],
    queryFn: async ({ pageParam }) => customFetchPagination<StockHistory>(`inventory/stock/history?${qs.stringify(pageParam)}`),
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
    enabled: !!params.ref_id && !!params.ref_type,
  })
}

export function useListProductSerials(params: PaginationParams<{
  sku_id: number
}>) {
  return useInfiniteQuery({
    queryKey: ["inventory", "serials", params],
    queryFn: async ({ pageParam }) => customFetchPagination<Serial>(`inventory/serial?${qs.stringify(pageParam)}`),
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
    enabled: !!params.sku_id,
  })
}

// Mutation functions
export function useImportStock() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: {
      ref_id: number
      ref_type: "ProductSku" | "Promotion"
      change: number
      serial_ids: string[]
    }) =>
      customFetchStandard<string>('inventory/stock/import', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["inventory", "serials"] })
      queryClient.invalidateQueries({ queryKey: ["inventory", "stock"] })
      queryClient.invalidateQueries({ queryKey: ["inventory", "stock-history"] })
    },
  })
}

export function useUpdateSkuSerial() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: {
      serial_ids: string[]
      status: "Active" | "Inactive" | "Sold" | "Damaged"
    }) =>
      customFetchStandard<string>(`inventory/serial`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory", "serials"] })
      queryClient.invalidateQueries({ queryKey: ["inventory", "stock"] })
    },
  })
}