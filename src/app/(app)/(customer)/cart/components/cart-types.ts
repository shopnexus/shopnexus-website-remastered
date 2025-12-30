import { CartItem as ApiCartItem } from "@/core/order/cart"

// Extend API CartItem with UI-specific fields
export interface CartItem extends ApiCartItem {
  bulk_price?: number // Bulk price in USDT (calculated from promotions)
  bulk_threshold?: number // Bulk threshold (calculated from promotions)
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
