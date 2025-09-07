import { customFetchStandard } from "@/lib/queryclient/custom-fetch"
import { useQuery } from "@tanstack/react-query"

export type CartItem = {
  id: string
  name: string
  original_price: number // Original price in USDT for showing discounts
  price: number // Price in USDT (base currency)
  quantity: number
  // minOrderQuantity: number
  image: string
  category: string
  bulk_price?: number // Bulk price in USDT
  bulk_threshold?: number
}

export const useGetCart = () =>
  useQuery({
    queryKey: ['account', 'cart'],
    queryFn: async () => customFetchStandard<CartItem[]>('account/cart'),
  })