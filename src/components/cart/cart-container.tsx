"use client"

import { useState } from "react"
import { CartItemList } from "./cart-item-list"
import { CartSummary } from "./cart-summary"
import { EmptyCart } from "./empty-cart"
import { CartItem } from "./cart-types"

const sampleCartItems: CartItem[] = [
	{
		id: "1",
		name: "Professional Office Chair - Ergonomic Design",
		price: 12.5, // Price in USDT
		quantity: 8,
		minOrderQuantity: 5,
		image: "/professional-office-chair.jpg",
		category: "Furniture",
		bulkPrice: 10.4, // Bulk price in USDT
		bulkThreshold: 10,
	},
	{
		id: "2",
		name: "Premium Paper Pack - 5000 Sheets",
		price: 2.08, // Price in USDT
		quantity: 25,
		minOrderQuantity: 10,
		image: "/office-paper-stack.jpg",
		category: "Office Supplies",
		bulkPrice: 1.67, // Bulk price in USDT
		bulkThreshold: 20,
	},
	{
		id: "3",
		name: "Standing Desk Converter - Height Adjustable",
		price: 7.92, // Price in USDT
		quantity: 3,
		minOrderQuantity: 1,
		image: "/standing-desk-converter.png",
		category: "Furniture",
		bulkPrice: 6.67, // Bulk price in USDT
		bulkThreshold: 5,
	},
]

export function CartContainer() {
	const [cartItems, setCartItems] = useState<CartItem[]>(sampleCartItems)

	const updateQuantity = (id: string, newQuantity: number) => {
		setCartItems((items) =>
			items.map((item) => {
				if (item.id === id) {
					const quantity = Math.max(item.minOrderQuantity, newQuantity)
					return { ...item, quantity }
				}
				return item
			})
		)
	}

	const removeItem = (id: string) => {
		setCartItems((items) => items.filter((item) => item.id !== id))
	}

	const clearCart = () => {
		setCartItems([])
	}

	if (cartItems.length === 0) {
		return <EmptyCart />
	}

	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
			{/* Cart Items - Takes up 2 columns on large screens */}
			<div className="lg:col-span-2">
				<CartItemList
					items={cartItems}
					onUpdateQuantity={updateQuantity}
					onRemoveItem={removeItem}
					onClearCart={clearCart}
				/>
			</div>

			{/* Cart Summary - Takes up 1 column on large screens */}
			<div className="lg:col-span-1">
				<div className="sticky top-6">
					<CartSummary items={cartItems} />
				</div>
			</div>
		</div>
	)
}
