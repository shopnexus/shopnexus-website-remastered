"use client"

import { useEffect, useState } from "react"
import { CartItemList } from "./cart-item-list"
import { CartSummary } from "./cart-summary"
import { EmptyCart } from "./empty-cart"
import { CartItem } from "./cart-types"
import { useGetCart } from "@/core/account/cart.customer"

export function CartContainer() {
	const { data: cartData } = useGetCart()

	const [cartItems, setCartItems] = useState<CartItem[]>([])

	useEffect(() => {
		if (cartData) {
			setCartItems(cartData)
		}
	}, [cartData])

	const updateQuantity = (id: string, newQuantity: number) => {
		setCartItems((items) =>
			items.map((item) => {
				if (item.sku_id === id) {
					// const quantity = Math.max(item.minOrderQuantity, newQuantity)
					return { ...item, quantity: newQuantity }
				}
				return item
			})
		)
	}

	const removeItem = (id: string) => {
		setCartItems((items) => items.filter((item) => item.sku_id !== id))
	}

	const clearCart = () => {
		setCartItems([])
	}

	const toggleSelectItem = (id: string, selected: boolean) => {
		setCartItems((items) =>
			items.map((item) => {
				if (item.sku_id === id) {
					return { ...item, selected }
				}
				return item
			})
		)
	}

	const selectAllItems = (selected: boolean) => {
		setCartItems((items) => items.map((item) => ({ ...item, selected })))
	}

	const getSelectedItems = () => {
		return cartItems.filter((item) => item.selected)
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
					onToggleSelect={toggleSelectItem}
					onSelectAll={selectAllItems}
				/>
			</div>

			{/* Cart Summary - Takes up 1 column on large screens */}
			<div className="lg:col-span-1">
				<div className="sticky top-6">
					<CartSummary items={cartItems} selectedItems={getSelectedItems()} />
				</div>
			</div>
		</div>
	)
}
