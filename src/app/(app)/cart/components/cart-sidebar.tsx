"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart } from "lucide-react"
import Link from "next/link"

interface CartItem {
	id: string
	name: string
	price: number
	quantity: number
	minOrderQuantity: number
	image: string
	category: string
	bulkPrice?: number
	bulkThreshold?: number
}

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
]

export function CartSidebar() {
	const [cartItems] = useState<CartItem[]>(sampleCartItems)
	const [highlight, setHighlight] = useState(false)
	const timeoutRef = useRef<number | null>(null)

	useEffect(() => {
		const handler = () => {
			setHighlight(true)
			if (timeoutRef.current) {
				window.clearTimeout(timeoutRef.current)
			}
			timeoutRef.current = window.setTimeout(() => setHighlight(false), 900)
		}
		window.addEventListener("cart:added", handler)
		return () => {
			window.removeEventListener("cart:added", handler)
			if (timeoutRef.current) {
				window.clearTimeout(timeoutRef.current)
			}
		}
	}, [])

	const getTotalItems = () =>
		cartItems.reduce((sum, item) => sum + item.quantity, 0)

	return (
		<Button variant="ghost" size="icon" className="relative" asChild>
			<Link href="/cart">
				<ShoppingCart className="h-5 w-5" />
				{getTotalItems() > 0 && (
					<Badge
						className={`absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 text-xs transition-transform duration-300 ${
							highlight
								? "animate-[cart-bounce_300ms_ease-out_0ms_2] ring-2 ring-red-500"
								: ""
						}`}
					>
						{getTotalItems()}
					</Badge>
				)}
			</Link>
		</Button>
	)
}
