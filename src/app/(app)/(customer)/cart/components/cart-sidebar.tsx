"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart } from "lucide-react"
import Link from "next/link"
import { useGetCart } from "@/core/account/cart"

export function CartSidebar() {
	const { data: cartItems = [] } = useGetCart()
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
