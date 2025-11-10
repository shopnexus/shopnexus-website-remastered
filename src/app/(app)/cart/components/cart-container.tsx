"use client"

import { useMemo, useState } from "react"
import { CartItemList } from "./cart-item-list"
import { CartSummary } from "./cart-summary"
import { EmptyCart } from "./empty-cart"
import { CartItem } from "./cart-types"
import { useGetCart, useUpdateCart, useClearCart } from "@/core/account/cart"

export function CartContainer() {
	const { data: cartData = [], isLoading } = useGetCart()
	const updateCartMutation = useUpdateCart()
	const clearCartMutation = useClearCart()

	// Add UI state for selected items (not in API)
	const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set())

	// Transform API data to include UI fields
	const cartItems: CartItem[] = useMemo(() => {
		return cartData.map((item) => ({
			...item,
			selected: selectedItems.has(item.sku_id),
		}))
	}, [cartData, selectedItems])

	const updateQuantity = async (id: number, newQuantity: number) => {
		if (newQuantity <= 0) {
			// Remove item if quantity is 0 or less
			await removeItem(id)
			return
		}
		try {
			await updateCartMutation.mutateAsync({
				sku_id: id,
				quantity: newQuantity,
			})
		} catch (error) {
			console.error("Failed to update cart:", error)
		}
	}

	const removeItem = async (id: number) => {
		try {
			await updateCartMutation.mutateAsync({
				sku_id: id,
				quantity: 0,
			})
			// Remove from selected items if it was selected
			setSelectedItems((prev) => {
				const next = new Set(prev)
				next.delete(id)
				return next
			})
		} catch (error) {
			console.error("Failed to remove item:", error)
		}
	}

	const clearCart = async () => {
		try {
			await clearCartMutation.mutateAsync()
			setSelectedItems(new Set())
		} catch (error) {
			console.error("Failed to clear cart:", error)
		}
	}

	const toggleSelectItem = (id: number, selected: boolean) => {
		setSelectedItems((prev) => {
			const next = new Set(prev)
			if (selected) {
				next.add(id)
			} else {
				next.delete(id)
			}
			return next
		})
	}

	const selectAllItems = (selected: boolean) => {
		if (selected) {
			setSelectedItems(new Set(cartItems.map((item) => item.sku_id)))
		} else {
			setSelectedItems(new Set())
		}
	}

	const getSelectedItems = () => {
		return cartItems.filter((item) => item.selected)
	}

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="text-muted-foreground">Loading cart...</div>
			</div>
		)
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
