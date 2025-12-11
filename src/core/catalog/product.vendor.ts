import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { customFetchPagination, customFetchStandard } from "@/lib/queryclient/custom-fetch"
import { PaginationParams } from "@/lib/queryclient/response.type"
import qs from "qs"
import { Resource } from "../common/resource.type"

// ===== TYPES =====

export type ProductAttribute = {
  name: string
  value: string
}

export type PackageDetails = {
  weight_grams: number
  length_cm: number
  width_cm: number
  height_cm: number
}

export type ProductSpecification = {
  name: string
  value: string
}

export type ProductSku = {
  id: number
  spu_id: number
  price: number
  can_combine: boolean
  date_created: string
  stock: number
  attributes: ProductAttribute[]
  package_details: PackageDetails
}

export type ProductSPU = {
  id: number
  code: string
  category: {
    id: number
    name: string
    description: string
    parent_id: string
  }
  brand: {
    id: number
    code: string
    name: string
    description: string
  }
  featured_sku_id: number | null
  name: string
  description: string
  is_active: boolean
  date_created: string
  date_updated: string
  resources: Resource[]
  rating: {
    score: number
    total: number
  }
  tags: string[]
  specifications?: ProductSpecification[]
}

// ===== REACT QUERY HOOKS =====

// List Product SPU (Infinite Query)
export const useListProductSPU = (params: PaginationParams<{
  code?: string[]
  category_id?: number[]
  brand_id?: number[]
  is_active?: boolean[]
}>) =>
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
    mutationFn: (params: {
      category_id: number
      brand_id: number
      name: string
      description: string
      is_active: boolean
      tags: string[]
      resource_ids: string[]
      specifications: ProductSpecification[]
    }) =>
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
    mutationFn: (params: {
      id: number
      category_id?: number
      featured_sku_id?: number
      brand_id?: number
      name?: string
      description?: string
      is_active?: boolean
      specifications?: ProductSpecification[]
    }) =>
      customFetchStandard<ProductSPU>('catalog/product-spu', {
        method: 'PATCH',
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
    mutationFn: (params: { id: number }) =>
      customFetchStandard<{ message: string }>(`catalog/product-spu/${params.id}`, {
        method: 'DELETE',
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['product-spu'] })
    },
  })
}

// Get Product SPU by ID
export const useGetProductSPU = (id: number | undefined) =>
  useQuery({
    queryKey: ['product-spu', 'detail', id],
    queryFn: () => customFetchStandard<ProductSPU>(`catalog/product-spu/${id}`),
    enabled: typeof id === 'number' && id > 0,
  })

export const useListProductSKU = (params: PaginationParams<{
  spu_id?: number
  price_from?: number
  price_to?: number
  can_combine?: boolean
}>) =>
  useQuery({
    queryKey: ['product-sku', 'list', params],
    queryFn: () => customFetchStandard<ProductSku[]>(`catalog/product-sku?${qs.stringify(params)}`),
  })

// Create Product SKU
export const useCreateProductSKU = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (params: {
      spu_id: number
      price: number
      can_combine: boolean
      attributes: ProductAttribute[]
      package_details: PackageDetails
    }) =>
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
    mutationFn: (params: {
      id: number
      price?: number
      can_combine?: boolean
      attributes?: ProductAttribute[]
      package_details?: PackageDetails
    }) =>
      customFetchStandard<ProductSku>('catalog/product-sku', {
        method: 'PATCH',
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
    mutationFn: (params: { id: number }) =>
      customFetchStandard<{ message: string }>('catalog/product-sku', {
        method: 'DELETE',
        body: JSON.stringify(params),
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['product-sku'] })
    },
  })
}