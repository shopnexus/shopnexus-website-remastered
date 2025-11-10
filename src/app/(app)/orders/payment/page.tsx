"use client"

import { CheckCircle, Package, Mail, Truck, Shield, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSearchParams } from "next/navigation"
import { useGetOrder } from "@/core/order/order.customer"
import Link from "next/link"

export default function PaymentSuccessPage() {
	const searchParams = useSearchParams()
	const orderId = searchParams.get("orderId") || searchParams.get("id")
	const orderIdNumber = orderId ? parseInt(orderId, 10) : null

	const { data: order, isLoading, isError } = useGetOrder(orderIdNumber || 0)

	if (!orderIdNumber) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-foreground mb-4">
						Order ID not found
					</h1>
					<p className="text-muted-foreground mb-4">
						Please provide a valid order ID in the URL.
					</p>
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
				<div className="text-center">
					<p className="text-muted-foreground">Loading order details...</p>
				</div>
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
					<p className="text-muted-foreground mb-4">
						Unable to load order details.
					</p>
					<Button asChild>
						<Link href="/orders">View Orders</Link>
					</Button>
				</div>
			</div>
		)
	}

	const formatDate = (dateString: string) => {
		const date = new Date(dateString)
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		})
	}

	return (
		<div className="min-h-screen">
			{/* Header Section */}
			<div className="">
				<div className="container mx-auto py-16">
					<div className="text-center mx-auto">
						<div className="mb-6 flex justify-center">
							<div className="relative">
								<CheckCircle className="h-20 w-20 text-primary animate-pulse" />
							</div>
						</div>
						<h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
							Payment Successful!
						</h1>
						<p className="text-xl text-muted-foreground mb-8 text-pretty">
							Thank you for your purchase! Your order has been confirmed and is
							being processed.
						</p>
						<Badge variant="secondary" className="text-lg px-4 py-2">
							Order #{order.id}
						</Badge>
					</div>
				</div>
			</div>

			<div className="container mx-auto py-12">
				<div className="mx-auto space-y-8">
					{/* Order Summary Card */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Package className="h-5 w-5" />
								Order Summary
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-6">
							{/* Order Items */}
							<div className="space-y-4">
								{order.items.length > 0 ? (
									order.items.map((item) => (
										<div
											key={item.id}
											className="flex items-center gap-4 p-4 rounded-lg bg-muted/30"
										>
											<div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center">
												<Package className="h-8 w-8 text-muted-foreground" />
											</div>
											<div className="flex-1">
												<h3 className="font-medium text-foreground">
													SKU #{item.sku_id}
												</h3>
												<p className="text-sm text-muted-foreground">
													Quantity: {item.quantity}
												</p>
												{item.note && (
													<p className="text-xs text-muted-foreground mt-1">
														Note: {item.note}
													</p>
												)}
											</div>
											<div className="text-right">
												<Badge variant="outline">{item.status}</Badge>
											</div>
										</div>
									))
								) : (
									<p className="text-muted-foreground text-center py-8">
										No items in this order.
									</p>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Next Steps */}
					<div className="grid md:grid-cols-2 gap-6">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Mail className="h-5 w-5" />
									What&apos;s Next?
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-start gap-3">
									<div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
									<div>
										<p className="font-medium text-foreground">
											Email Confirmation
										</p>
										<p className="text-sm text-muted-foreground">
											You&apos;ll receive an email confirmation shortly with
											your receipt and tracking information.
										</p>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
									<div>
										<p className="font-medium text-foreground">
											Order Processing
										</p>
										<p className="text-sm text-muted-foreground">
											Your order is being prepared and will ship within 1-2
											business days.
										</p>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<div className="h-2 w-2 rounded-full bg-accent mt-2 flex-shrink-0" />
									<div>
										<p className="font-medium text-foreground">Order Date</p>
										<p className="text-sm text-muted-foreground">
											{formatDate(order.date_created)}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Truck className="h-5 w-5" />
									Track Your Order
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<p className="text-muted-foreground text-sm">
									Once your order ships, you&apos;ll receive tracking
									information to monitor your package.
								</p>
								<Button className="w-full" size="lg" asChild>
									<Link href={`/orders/${order.id}`}>View Order Details</Link>
								</Button>
								<Button
									variant="outline"
									className="w-full bg-transparent"
									asChild
								>
									<Link href="/search">Continue Shopping</Link>
								</Button>
							</CardContent>
						</Card>
					</div>

					{/* Trust Signals */}
					<Card>
						<CardContent className="pt-6">
							<div className="grid md:grid-cols-3 gap-6 text-center">
								<div className="flex flex-col items-center gap-2">
									<Shield className="h-8 w-8 text-primary" />
									<h3 className="font-semibold text-foreground">
										Secure Payment
									</h3>
									<p className="text-sm text-muted-foreground">
										Your payment information is protected with bank-level
										security.
									</p>
								</div>
								<div className="flex flex-col items-center gap-2">
									<Truck className="h-8 w-8 text-primary" />
									<h3 className="font-semibold text-foreground">
										Fast Shipping
									</h3>
									<p className="text-sm text-muted-foreground">
										Fast and reliable shipping. Most orders arrive within 3-5
										days.
									</p>
								</div>
								<div className="flex flex-col items-center gap-2">
									<Star className="h-8 w-8 text-primary" />
									<h3 className="font-semibold text-foreground">
										Customer Satisfaction
									</h3>
									<p className="text-sm text-muted-foreground">
										30-day return policy. We&apos;re here to help with any
										questions.
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	)
}
