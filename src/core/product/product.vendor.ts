import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { customFetchPagination, customFetchStandard } from "@/lib/queryclient/custom-fetch"
import { PaginationParams } from "@/lib/queryclient/response.type"
import qs from "qs"

// ===== TYPES =====

export type ProductAttribute = {
  name: string
  value: string
}

export type ProductSku = {
  id: number
  code: string
  spu_id: number
  price: number
  can_combine: boolean
  date_created: string
  date_deleted: string | null
  attributes: ProductSkuAttribute[]
}

export type ProductSkuAttribute = {
  id: number
  code: string
  sku_id: number
  name: string
  value: string
  date_created: string
  date_updated: string
}

export type ProductSPU = {
  id: number
  code: string
  vendor_id: number
  category_id: number
  brand_id: number
  name: string
  description: string
  is_active: boolean
  featured_sku_id: number | null
  date_manufactured: string | null
  date_created: string
  date_updated: string
  date_deleted: string | null
}

// ===== PARAM TYPES =====

export type ListProductSPUParams = PaginationParams<{
  code?: string[]
  category_id?: number[]
  brand_id?: number[]
  is_active?: boolean[]
}>

export type CreateProductSPUParams = {
  category_id: number
  brand_id: number
  name: string
  description: string
}

export type UpdateProductSPUParams = {
  id: number
  category_id?: number
  featured_sku_id?: number
  brand_id?: number
  name?: string
  description?: string
  is_active?: boolean
}

export type DeleteProductSPUParams = {
  id: number
}

export type ListProductSKUParams = PaginationParams<{
  spu_id: number[]
  price: number[]
}>

export type CreateProductSKUParams = {
  spu_id: number
  price: number
  can_combine: boolean
  attributes?: ProductAttribute[]
}

export type UpdateProductSKUParams = {
  id: number
  price?: number
  can_combine?: boolean
  attributes?: ProductAttribute[]
}

export type DeleteProductSKUParams = {
  id: number
}

// ===== REACT QUERY HOOKS =====

// List Product SPU (Infinite Query)
export const useListProductSPU = (params: ListProductSPUParams) =>
  useInfiniteQuery({
    queryKey: ['product-spu', 'list', params],
    queryFn: async ({ pageParam }) => customFetchPagination<ProductSPU>(`catalog/product-spu?${qs.stringify(pageParam)}`),
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

// Create Product SPU
export const useCreateProductSPU = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (params: CreateProductSPUParams) =>
      customFetchStandard<ProductSPU>('catalog/product-spu', {
        method: 'POST',
        body: JSON.stringify(params),
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['product-spu'] })
    },
  })
}

// Update Product SPU
export const useUpdateProductSPU = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (params: UpdateProductSPUParams) =>
      customFetchStandard<ProductSPU>('catalog/product-spu', {
        method: 'PUT',
        body: JSON.stringify(params),
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['product-spu'] })
    },
  })
}

// Delete Product SPU
export const useDeleteProductSPU = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (params: DeleteProductSPUParams) =>
      customFetchStandard<{ message: string }>('catalog/product-spu', {
        method: 'DELETE',
        body: JSON.stringify(params),
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['product-spu'] })
    },
  })
}

// List Product SKU (Infinite Query)
export const useListProductSKU = (params: ListProductSKUParams) =>
  useInfiniteQuery({
    queryKey: ['product-sku', 'list', params],
    queryFn: async ({ pageParam }) => customFetchPagination<ProductSku>(`catalog/product-sku?${qs.stringify(pageParam)}`),
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

// Create Product SKU
export const useCreateProductSKU = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (params: CreateProductSKUParams) =>
      customFetchStandard<ProductSku>('catalog/product-sku', {
        method: 'POST',
        body: JSON.stringify(params),
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['product-sku'] })
    },
  })
}

// Update Product SKU
export const useUpdateProductSKU = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (params: UpdateProductSKUParams) =>
      customFetchStandard<ProductSku>('catalog/product-sku', {
        method: 'PUT',
        body: JSON.stringify(params),
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['product-sku'] })
    },
  })
}

// Delete Product SKU
export const useDeleteProductSKU = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (params: DeleteProductSKUParams) =>
      customFetchStandard<{ message: string }>('catalog/product-sku', {
        method: 'DELETE',
        body: JSON.stringify(params),
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['product-sku'] })
    },
  })
}