import { Resource } from "@/core/shared/resource.type"

export interface CartItem {
  sku_id: string
  sku_name: string
  spu_id: string
  name: string
  original_price: number // Original price in USDT for showing discounts
  price: number // Price in USDT (base currency)
  quantity: number
  // minOrderQuantity: number
  resource: Resource
  category: string
  bulk_price?: number // Bulk price in USDT
  bulk_threshold?: number
  selected?: boolean // For partial checkout
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
  onToggleSelect?: (id: string, selected: boolean) => void
}

export interface CartItemListProps {
  items: CartItem[]
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemoveItem: (id: string) => void
  onClearCart: () => void
  onToggleSelect?: (id: string, selected: boolean) => void
  onSelectAll?: (selected: boolean) => void
}

export interface CartSummaryProps {
  items: CartItem[]
  selectedItems?: CartItem[]
}
