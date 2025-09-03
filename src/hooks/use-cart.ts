"use client"

import { useState, useCallback } from "react"
import { CartItem } from "@/components/cart/cart-types"

const sampleCartItems: CartItem[] = [
  {
    id: "1",
    name: "Professional Office Chair - Ergonomic Design",
    price: 299.99,
    quantity: 8,
    minOrderQuantity: 5,
    image: "/professional-office-chair.jpg",
    category: "Furniture",
    bulkPrice: 249.99,
    bulkThreshold: 10,
  },
  {
    id: "2",
    name: "Premium Paper Pack - 5000 Sheets",
    price: 49.99,
    quantity: 25,
    minOrderQuantity: 10,
    image: "/office-paper-stack.jpg",
    category: "Office Supplies",
    bulkPrice: 39.99,
    bulkThreshold: 20,
  },
  {
    id: "3",
    name: "Standing Desk Converter - Height Adjustable",
    price: 189.99,
    quantity: 3,
    minOrderQuantity: 1,
    image: "/standing-desk-converter.png",
    category: "Furniture",
    bulkPrice: 159.99,
    bulkThreshold: 5,
  },
]

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>(sampleCartItems)

  const updateQuantity = useCallback((id: string, newQuantity: number) => {
    setCartItems((items) =>
      items.map((item) => {
        if (item.id === id) {
          const quantity = Math.max(item.minOrderQuantity, newQuantity)
          return { ...item, quantity }
        }
        return item
      }),
    )
  }, [])

  const removeItem = useCallback((id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id))
  }, [])

  const clearCart = useCallback(() => {
    setCartItems([])
  }, [])

  const addItem = useCallback((newItem: CartItem) => {
    setCartItems((items) => {
      const existingItem = items.find((item) => item.id === newItem.id)
      if (existingItem) {
        return items.map((item) =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        )
      }
      return [...items, newItem]
    })
  }, [])

  const getItemPrice = useCallback((item: CartItem) => {
    if (item.bulkPrice && item.bulkThreshold && item.quantity >= item.bulkThreshold) {
      return item.bulkPrice
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
      if (item.bulkPrice && item.bulkThreshold && item.quantity >= item.bulkThreshold) {
        return sum + (item.price - item.bulkPrice) * item.quantity
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
