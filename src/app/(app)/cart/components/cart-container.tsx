"use client"

import { useEffect, useState } from "react"
import { CartItemList } from "./cart-item-list"
import { CartSummary } from "./cart-summary"
import { EmptyCart } from "./empty-cart"
import { CartItem } from "./cart-types"
import { useGetCart } from "@/core/account/cart.customer"

const sampleCartItems: CartItem[] = [
	{
		sku_id: "1",
		sku_name: "SKU-001",
		spu_id: "spu-001",
		name: "Professional Office Chair - Ergonomic Design",
		original_price: 15.0,
		price: 12.5, // Price in USDT
		quantity: 8,
		resource: {
			id: 1,
			mime: "image/jpeg",
			url: "/professional-office-chair.jpg",
			file_size: 1024000,
			width: 800,
			height: 600,
			duration: 0,
		},
		category: "Furniture",
		bulk_price: 10.4, // Bulk price in USDT
		bulk_threshold: 10,
		selected: true,
	},
	{
		sku_id: "2",
		sku_name: "SKU-002",
		spu_id: "spu-002",
		name: "Premium Paper Pack - 5000 Sheets",
		original_price: 2.5,
		price: 2.08, // Price in USDT
		quantity: 25,
		resource: {
			id: 2,
			mime: "image/jpeg",
			url: "/office-paper-stack.jpg",
			file_size: 800000,
			width: 600,
			height: 400,
			duration: 0,
		},
		category: "Office Supplies",
		bulk_price: 1.67, // Bulk price in USDT
		bulk_threshold: 20,
		selected: false,
	},
	{
		sku_id: "3",
		sku_name: "SKU-003",
		spu_id: "spu-003",
		name: "Standing Desk Converter - Height Adjustable",
		original_price: 9.5,
		price: 7.92, // Price in USDT
		quantity: 3,
		resource: {
			id: 3,
			mime: "image/png",
			url: "/standing-desk-converter.png",
			file_size: 1200000,
			width: 800,
			height: 600,
			duration: 0,
		},
		category: "Furniture",
		bulk_price: 6.67, // Bulk price in USDT
		bulk_threshold: 5,
		selected: true,
	},
]

export function CartContainer() {
	const { data: cartData } = useGetCart()

	const [cartItems, setCartItems] = useState<CartItem[]>(sampleCartItems)

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
