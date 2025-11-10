"use client"

import { OrderTracking } from "../components/order-tracking"
import { useGetOrder } from "@/core/order/order.customer"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function OrderDetailPage() {
	const params = useParams()
	const orderId = params?.id ? parseInt(params.id as string, 10) : null

	const { data: order, isLoading, isError } = useGetOrder(orderId || 0)

	if (!orderId) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-foreground mb-4">
						Order ID not found
					</h1>
					<Button asChild>
						<Link href="/orders">View Orders</Link>
					</Button>
				</div>
			</div>
		)
	}

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-muted-foreground">Loading order details...</p>
			</div>
		)
	}

	if (isError || !order) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-foreground mb-4">
						Order not found
					</h1>
					<Button asChild>
						<Link href="/orders">View Orders</Link>
					</Button>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen flex flex-col">
			<main className="flex-1 py-8">
				<div className="container max-w-4xl mx-auto">
					<OrderTracking order={order} />
				</div>
			</main>
		</div>
	)
}
