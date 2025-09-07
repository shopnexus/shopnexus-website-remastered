export interface CartItem {
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

export interface CartSummaryData {
  total_items: number
  subtotal: number
  bulk_savings: number
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
