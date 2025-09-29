import { customFetchStandard } from "@/lib/queryclient/custom-fetch"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Resource } from "../shared/resource.type"

export type CartItem = {
  sku_id: string
  spu_id: string
  name: string
  sku_name: string
  original_price: number // Original price in USDT for showing discounts
  price: number // Price in USDT (base currency)
  quantity: number
  // minOrderQuantity: number
  resource: Resource
  category: string
  bulk_price?: number // Bulk price in USDT
  bulk_threshold?: number
}

export const useGetCart = () =>
  useQuery({
    queryKey: ['account', 'cart'],
    queryFn: async () => customFetchStandard<CartItem[]>('account/cart'),
  })

export type UpdateCartParams = {
  sku_id: number
  quantity?: number
  delta_quantity?: number
}

export const useUpdateCart = () =>
  useMutation({
    mutationFn: async (params: UpdateCartParams) => customFetchStandard<"OK">('account/cart', {
      method: 'POST',
      body: JSON.stringify(params),
    }),
  })
