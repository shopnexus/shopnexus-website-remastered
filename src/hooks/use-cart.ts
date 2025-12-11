"use client"

import { useState, useCallback } from "react"
import { CartItem } from "@/app/(app)/(customer)/cart/components/cart-types"

const sampleCartItems: CartItem[] = [
  {
    sku_id: "1",
    name: "Professional Office Chair - Ergonomic Design",
    price: 299.99,
    quantity: 8,
    minOrderQuantity: 5,
    resources: "/professional-office-chair.jpg",
    category: "Furniture",
    bulk_price: 249.99,
    bulk_threshold: 10,
  },
  {
    sku_id: "2",
    name: "Premium Paper Pack - 5000 Sheets",
    price: 49.99,
    quantity: 25,
    minOrderQuantity: 10,
    resources: "/office-paper-stack.jpg",
    category: "Office Supplies",
    bulk_price: 39.99,
    bulk_threshold: 20,
  },
  {
    sku_id: "3",
    name: "Standing Desk Converter - Height Adjustable",
    price: 189.99,
    quantity: 3,
    minOrderQuantity: 1,
    resources: "/standing-desk-converter.png",
    category: "Furniture",
    bulk_price: 159.99,
    bulk_threshold: 5,
  },
]

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>(sampleCartItems)

  const updateQuantity = useCallback((id: string, newQuantity: number) => {
    setCartItems((items) =>
      items.map((item) => {
        if (item.sku_id === id) {
          const quantity = Math.max(item.minOrderQuantity, newQuantity)
          return { ...item, quantity }
        }
        return item
      }),
    )
  }, [])

  const removeItem = useCallback((id: string) => {
    setCartItems((items) => items.filter((item) => item.sku_id !== id))
  }, [])

  const clearCart = useCallback(() => {
    setCartItems([])
  }, [])

  const addItem = useCallback((newItem: CartItem) => {
    setCartItems((items) => {
      const existingItem = items.find((item) => item.sku_id === newItem.sku_id)
      if (existingItem) {
        return items.map((item) =>
          item.sku_id === newItem.sku_id
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        )
      }
      return [...items, newItem]
    })
  }, [])

  const getItemPrice = useCallback((item: CartItem) => {
    if (item.bulk_price && item.bulk_threshold && item.quantity >= item.bulk_threshold) {
      return item.bulk_price
    }
    return item.price
  }, [])

  const getTotalItems = useCallback(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0)
  }, [cartItems])

  const getSubtotal = useCallback(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }, [cartItems])

  const getBulkSavings = useCallback(() => {
    return cartItems.reduce((sum, item) => {
      if (item.bulk_price && item.bulk_threshold && item.quantity >= item.bulk_threshold) {
        return sum + (item.price - item.bulk_price) * item.quantity
      }
      return sum
    }, 0)
  }, [cartItems])

  const getTotal = useCallback(() => {
    return cartItems.reduce((sum, item) => sum + getItemPrice(item) * item.quantity, 0)
  }, [cartItems, getItemPrice])

  return {
    cartItems,
    updateQuantity,
    removeItem,
    clearCart,
    addItem,
    getItemPrice,
    getTotalItems,
    getSubtotal,
    getBulkSavings,
    getTotal,
  }
}
