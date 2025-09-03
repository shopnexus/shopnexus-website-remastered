export interface CartItem {
  id: string
  name: string
  price: number // Price in USDT (base currency)
  quantity: number
  minOrderQuantity: number
  image: string
  category: string
  bulkPrice?: number // Bulk price in USDT
  bulkThreshold?: number
}

export interface CartSummaryData {
  totalItems: number
  subtotal: number
  bulkSavings: number
  total: number
}

export interface CartItemProps {
  item: CartItem
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemoveItem: (id: string) => void
}

export interface CartItemListProps {
  items: CartItem[]
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemoveItem: (id: string) => void
  onClearCart: () => void
}

export interface CartSummaryProps {
  items: CartItem[]
}
