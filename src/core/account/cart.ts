import { customFetchStandard } from "@/lib/queryclient/custom-fetch"
import { useMutation, useQuery } from "@tanstack/react-query"
import { getQueryClient } from "../../lib/queryclient/query-client"
import { Resource } from "../common/resource.type"
import qs from "qs"

const queryClient = getQueryClient()

// Type matching CartItemDTO from contract
export type CartItem = {
  sku_id: number
  spu_id: number
  name: string
  sku_name: string
  original_price: number
  price: number
  quantity: number
  resources: Resource[]
  category: string
  promotions: number[]
}

export type Cart = CartItem[]

// Cart queries
export const useGetCart = () =>
  useQuery({
    queryKey: ['account', 'cart'],
    queryFn: async () => customFetchStandard<Cart>('account/cart'),
  })

export const useUpdateCart = () =>
  useMutation({
    mutationFn: async (params: {
      sku_id: number
      quantity?: number // either quantity or delta_quantity must be provided
      delta_quantity?: number
    }) =>
      customFetchStandard<Cart>('account/cart', {
        method: 'POST',
        body: JSON.stringify(params),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['account', 'cart'] })
    },
  })

export const useClearCart = () =>
  useMutation({
    mutationFn: async () =>
      customFetchStandard<{ message: string }>('account/cart', {
        method: 'DELETE',
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['account', 'cart'] })
    },
  })

  
export const useListCheckoutSkus = (
  params?: {
    sku_id: number
    quantity: number
  }) =>
  useQuery({
    queryKey: ['cart', 'list', params],
    queryFn: () => {
      return customFetchStandard<CartItem[]>(`account/cart/buynow?${qs.stringify(params)}`)
    },
    enabled: params !== undefined,
  })