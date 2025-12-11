import { customFetchStandard } from "@/lib/queryclient/custom-fetch"
import { useMutation, useQuery } from "@tanstack/react-query"
import { getQueryClient } from "@/lib/queryclient/query-client"
import { Resource } from "../common/resource.type"

// ===== Types =====

export type CartItem = {
  sku_id: string
  spu_id: string
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

// ===== Hooks =====

export const useGetCart = () =>
  useQuery({
    queryKey: ['account', 'cart'],
    queryFn: async () => customFetchStandard<Cart>('order/cart'),
  })

export const useUpdateCart = () =>
  useMutation({
    mutationFn: async (params: {
      sku_id: string
      quantity?: number // either quantity or delta_quantity must be provided
      delta_quantity?: number
    }) =>
      customFetchStandard<{ message: string }>('order/cart', {
        method: 'POST',
        body: JSON.stringify(params),
      }),
    onSuccess: async () => {
      const queryClient = getQueryClient()
      await queryClient.invalidateQueries({ queryKey: ['account', 'cart'] })
    },
  })

export const useClearCart = () =>
  useMutation({
    mutationFn: async () =>
      customFetchStandard<{ message: string }>('order/cart', {
        method: 'DELETE',
      }),
    onSuccess: async () => {
      const queryClient = getQueryClient()
      await queryClient.invalidateQueries({ queryKey: ['account', 'cart'] })
    },
  })

