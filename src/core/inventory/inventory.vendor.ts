import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { customFetchStandard } from "../../lib/queryclient/custom-fetch"
import qs from "qs"

// Types for inventory management
export interface ProductSerial {
  id: number
  serial_number: string
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

export interface ImportStockRequest {
  ref_id: number
  ref_type: "ProductSku" | "Promotion"
  change: number
  serial_ids: string[]
}

// Query functions
export function useListProductSerials(params?: { sku_id?: number; status?: string }) {
  return useQuery({
    queryKey: ["inventory", "serials", params],
    queryFn: () => customFetchStandard<ProductSerial[]>(`inventory/serials?${qs.stringify(params || {})}`),
  })
}

export function useListStock(params?: { ref_type?: string; ref_id?: number }) {
  return useQuery({
    queryKey: ["inventory", "stock", params],
    queryFn: () => customFetchStandard<Stock[]>(`inventory/stock?${qs.stringify(params || {})}`),
  })
}

export function useListStockHistory(params?: { stock_id?: number; limit?: number }) {
  return useQuery({
    queryKey: ["inventory", "stock-history", params],
    queryFn: () => customFetchStandard<StockHistory[]>(`inventory/stock-history?${qs.stringify(params || {})}`),
  })
}

// Mutation functions
export function useImportStock() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ImportStockRequest) =>
      customFetchStandard<string>('inventory/import', {
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

export function useUpdateSerialStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: ProductSerial["status"] }) =>
      customFetchStandard<ProductSerial>(`inventory/serials/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory", "serials"] })
      queryClient.invalidateQueries({ queryKey: ["inventory", "stock"] })
    },
  })
}

export function useAdjustStock() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      stock_id,
      change,
      reason
    }: {
      stock_id: number
      change: number
      reason?: string
    }) =>
      customFetchStandard<{ success: boolean }>('inventory/adjust', {
        method: 'POST',
        body: JSON.stringify({
          stock_id,
          change,
          reason
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory", "stock"] })
      queryClient.invalidateQueries({ queryKey: ["inventory", "stock-history"] })
    },
  })
}