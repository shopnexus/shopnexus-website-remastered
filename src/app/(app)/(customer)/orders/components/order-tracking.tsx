"use client"

import { useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Package, Truck, CheckCircle, Clock } from "lucide-react"
import { TOrder } from "@/core/order/order.customer"
import { useQuote } from "@/core/order/order.customer"

interface OrderTrackingProps {
	order: TOrder
}

export function OrderTracking({ order }: OrderTrackingProps) {
	const quoteMutation = useQuote()

	// Get quote for subtotal and shipping
	useEffect(() => {
		if (order.items.length > 0 && order.address) {
			quoteMutation.mutate({
				address: order.address,
				items: order.items.map((item) => ({
					sku_id: item.sku_id,
					quantity: item.quantity,
					shipment_option: "standard", // TODO: get from order data or shipment API
					...(item.note && { note: item.note }),
				})),
			})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [order.items.length, order.address])

	const getStatusProgress = () => {
		const status = order.items[0]?.status?.toLowerCase() || ""
		switch (status) {
			case "processing":
				return 25
			case "shipped":
				return 75
			case "delivered":
				return 100
			case "cancelled":
				return 0
			default:
				return 25
		}
	}

	const getOrderStatus = () => {
		return order.items[0]?.status || "pending"
	}

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString()
	}

	const orderStatus = getOrderStatus().toLowerCase()
	const trackingSteps = [
		{
			id: "ordered",
			title: "Order Placed",
			description: "Your order has been received and is being processed",
			icon: Package,
			completed: true,
			date: order.date_created,
		},
		{
			id: "processing",
			title: "Processing",
			description: "Your order is being prepared for shipment",
			icon: Clock,
			completed: orderStatus !== "processing",
			date: orderStatus !== "processing" ? order.date_updated : undefined,
		},
		{
			id: "shipped",
			title: "Shipped",
			description: "Your order is on its way",
			icon: Truck,
			completed: orderStatus === "delivered",
			date:
				orderStatus === "shipped" || orderStatus === "delivered"
					? order.date_updated
					: undefined,
		},
		{
			id: "delivered",
			title: "Delivered",
			description: "Your order has been delivered",
			icon: CheckCircle,
			completed: orderStatus === "delivered",
			date: orderStatus === "delivered" ? order.date_updated : undefined,
		},
	]

	return (
		<div className="space-y-6 grow">
			{/* Order Header */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle>Order #{order.id}</CardTitle>
							<CardDescription>
								Placed on {formatDate(order.date_created)}
							</CardDescription>
						</div>
						<Badge
							variant={
								orderStatus === "delivered" ? "default" : "secondary"
							}
							className="capitalize"
						>
							{orderStatus}
						</Badge>
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div>
							<div className="flex justify-between text-sm mb-2">
								<span>Order Progress</span>
								<span>{getStatusProgress()}%</span>
							</div>
							<Progress value={getStatusProgress()} className="h-2" />
						</div>


						<div className="grid gap-4 md:grid-cols-2">
							<div>
								<p className="text-sm font-medium mb-1">Payment Status</p>
								<p className="text-sm text-muted-foreground capitalize">
									{order.payment_status}
								</p>
							</div>
							<div>
								<p className="text-sm font-medium mb-1">Delivery Address</p>
								<div className="text-sm text-muted-foreground">
									<p>{order.address}</p>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Tracking Timeline */}
			<Card>
				<CardHeader>
					<CardTitle>Tracking Timeline</CardTitle>
					<CardDescription>
						Follow your order's journey from our warehouse to your door
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-6">
						{trackingSteps.map((step, index) => {
							const Icon = step.icon
							const isActive =
								(orderStatus === "processing" && step.id === "processing") ||
								(orderStatus === "shipped" && step.id === "shipped") ||
								(orderStatus === "delivered" && step.id === "delivered")

							return (
								<div key={step.id} className="flex space-x-4">
									<div className="flex flex-col items-center">
										<div
											className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${step.completed
												? "border-primary bg-primary text-primary-foreground"
												: isActive
													? "border-primary bg-background text-primary"
													: "border-muted bg-background text-muted-foreground"
												}`}
										>
											<Icon className="h-5 w-5" />
										</div>
										{index < trackingSteps.length - 1 && (
											<div
												className={`mt-2 h-8 w-0.5 ${step.completed ? "bg-primary" : "bg-muted"
													}`}
											/>
										)}
									</div>
									<div className="flex-1 pb-8">
										<div className="flex items-center justify-between">
											<h4
												className={`font-medium ${step.completed || isActive
													? "text-foreground"
													: "text-muted-foreground"
													}`}
											>
												{step.title}
											</h4>
											{step.date && (
												<span className="text-sm text-muted-foreground">
													{new Date(step.date).toLocaleDateString()}
												</span>
											)}
										</div>
										<p
											className={`text-sm ${step.completed || isActive
												? "text-muted-foreground"
												: "text-muted-foreground/60"
												}`}
										>
											{step.description}
										</p>
									</div>
								</div>
							)
						})}
					</div>
				</CardContent>
			</Card>

			{/* Order Items */}
			<Card>
				<CardHeader>
					<CardTitle>Order Items</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{order.items.map((item) => (
							<div key={item.id} className="flex space-x-4">
								<div className="relative h-20 w-20 overflow-hidden rounded-lg border flex-shrink-0 bg-muted flex items-center justify-center">
									<Package className="h-8 w-8 text-muted-foreground" />
								</div>
								<div className="flex-1 space-y-2">
									<div>
										<h4 className="text-sm font-medium line-clamp-2">
											SKU #{item.sku_id}
										</h4>
										{item.note && (
											<div className="text-sm text-muted-foreground">
												Note: {item.note}
											</div>
										)}
									</div>
									<div className="flex justify-between items-center text-sm">
										<span className="text-muted-foreground">
											Qty: {item.quantity}
										</span>
										<Badge variant="outline" className="capitalize">
											{item.status}
										</Badge>
									</div>
								</div>
							</div>
						))}

						<Separator />

						{/* TODO: use invoice api */}
						<div className="space-y-3">
							{quoteMutation.isPending ? (
								<div className="text-sm text-muted-foreground text-center py-4">
									Calculating pricing...
								</div>
							) : quoteMutation.isError ? (
								<div className="text-sm text-muted-foreground text-center py-4">
									Unable to load pricing
								</div>
							) : quoteMutation.data ? (
								<>
									<div className="flex justify-between text-sm">
										<span>Subtotal:</span>
										<span>${quoteMutation.data.product_cost.toFixed(2)}</span>
									</div>
									<div className="flex justify-between text-sm">
										<span>Shipping:</span>
										<span>${quoteMutation.data.ship_cost.toFixed(2)}</span>
									</div>
								</>
							) : null}
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
