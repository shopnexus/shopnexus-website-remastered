"use client"

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

interface OrderTrackingProps {
	order: {
		id: string
		status: "processing" | "shipped" | "delivered" | "cancelled"
		orderDate: string
		estimatedDelivery: string
		trackingNumber?: string
		items: Array<{
			sku_id: string
			name: string
			sku_name: string
			quantity: number
			price: number
			resource: {
				url: string
			}
		}>
		shippingAddress: {
			company: string
			address: string
			city: string
			state: string
			zip: string
		}
	}
}

export function OrderTracking({ order }: OrderTrackingProps) {
	const getStatusProgress = () => {
		switch (order.status) {
			case "processing":
				return 25
			case "shipped":
				return 75
			case "delivered":
				return 100
			case "cancelled":
				return 0
			default:
				return 0
		}
	}

	const getStatusColor = () => {
		switch (order.status) {
			case "processing":
				return "bg-blue-500"
			case "shipped":
				return "bg-orange-500"
			case "delivered":
				return "bg-green-500"
			case "cancelled":
				return "bg-red-500"
			default:
				return "bg-gray-500"
		}
	}

	const trackingSteps = [
		{
			id: "ordered",
			title: "Order Placed",
			description: "Your order has been received and is being processed",
			icon: Package,
			completed: true,
			date: order.orderDate,
		},
		{
			id: "processing",
			title: "Processing",
			description: "Your order is being prepared for shipment",
			icon: Clock,
			completed: order.status !== "processing",
			date: order.status !== "processing" ? "2024-01-16" : undefined,
		},
		{
			id: "shipped",
			title: "Shipped",
			description: "Your order is on its way",
			icon: Truck,
			completed: order.status === "delivered",
			date:
				order.status === "shipped" || order.status === "delivered"
					? "2024-01-17"
					: undefined,
		},
		{
			id: "delivered",
			title: "Delivered",
			description: "Your order has been delivered",
			icon: CheckCircle,
			completed: order.status === "delivered",
			date: order.status === "delivered" ? "2024-01-19" : undefined,
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
								Placed on {new Date(order.orderDate).toLocaleDateString()}
							</CardDescription>
						</div>
						<Badge
							variant={order.status === "delivered" ? "default" : "secondary"}
							className="capitalize"
						>
							{order.status}
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

						{order.trackingNumber && (
							<div className="flex items-center justify-between p-3 bg-muted rounded-lg">
								<div>
									<p className="text-sm font-medium">Tracking Number</p>
									<p className="text-sm text-muted-foreground">
										{order.trackingNumber}
									</p>
								</div>
								<Badge variant="outline">Track Package</Badge>
							</div>
						)}

						<div className="grid gap-4 md:grid-cols-2">
							<div>
								<p className="text-sm font-medium mb-1">Estimated Delivery</p>
								<p className="text-sm text-muted-foreground">
									{new Date(order.estimatedDelivery).toLocaleDateString()}
								</p>
							</div>
							<div>
								<p className="text-sm font-medium mb-1">Delivery Address</p>
								<div className="text-sm text-muted-foreground">
									<p>{order.shippingAddress.company}</p>
									<p>{order.shippingAddress.address}</p>
									<p>
										{order.shippingAddress.city}, {order.shippingAddress.state}{" "}
										{order.shippingAddress.zip}
									</p>
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
								(order.status === "processing" && step.id === "processing") ||
								(order.status === "shipped" && step.id === "shipped") ||
								(order.status === "delivered" && step.id === "delivered")

							return (
								<div key={step.id} className="flex space-x-4">
									<div className="flex flex-col items-center">
										<div
											className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
												step.completed
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
												className={`mt-2 h-8 w-0.5 ${
													step.completed ? "bg-primary" : "bg-muted"
												}`}
											/>
										)}
									</div>
									<div className="flex-1 pb-8">
										<div className="flex items-center justify-between">
											<h4
												className={`font-medium ${
													step.completed || isActive
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
											className={`text-sm ${
												step.completed || isActive
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
							<div key={item.sku_id} className="flex space-x-4">
								<div className="relative h-20 w-20 overflow-hidden rounded-lg border flex-shrink-0">
									<img
										src={item.resource.url || "/placeholder.svg"}
										alt={item.name}
										className="h-full w-full object-cover"
									/>
								</div>
								<div className="flex-1 space-y-2">
									<div>
										<h4 className="text-sm font-medium line-clamp-2">
											{item.name}
										</h4>
										<div className="text-sm text-muted-foreground">
											{item.sku_name}
										</div>
									</div>
									<div className="flex justify-between text-sm">
										<span className="text-muted-foreground">
											Qty: {item.quantity}
										</span>
										<span className="font-medium">
											${(item.price * item.quantity).toFixed(2)}
										</span>
									</div>
								</div>
							</div>
						))}

						<Separator />

						<div className="space-y-3">
							<div className="flex justify-between text-sm">
								<span>Subtotal:</span>
								<span>
									$
									{order.items
										.reduce((sum, item) => sum + item.price * item.quantity, 0)
										.toFixed(2)}
								</span>
							</div>
							<div className="flex justify-between text-sm">
								<span>Shipping:</span>
								<span className="text-green-600 font-medium">FREE</span>
							</div>
							<div className="flex justify-between text-sm">
								<span>Tax:</span>
								<span>
									$
									{(
										order.items.reduce(
											(sum, item) => sum + item.price * item.quantity,
											0
										) * 0.08
									).toFixed(2)}
								</span>
							</div>
							<Separator />
							<div className="flex justify-between text-lg font-bold">
								<span>Total:</span>
								<span>
									$
									{(
										order.items.reduce(
											(sum, item) => sum + item.price * item.quantity,
											0
										) * 1.08
									).toFixed(2)}
								</span>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
