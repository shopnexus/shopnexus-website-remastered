import { CheckCircle, Package, Mail, Truck, Shield, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function PaymentSuccessPage() {
	const orderDetails = {
		orderNumber: "ORD-2024-001234",
		date: "December 15, 2024",
		total: "$127.98",
		items: [
			{
				name: "Wireless Bluetooth Headphones",
				price: "$89.99",
				quantity: 1,
				image: "/wireless-headphones.png",
			},
			{
				name: "Phone Case - Clear",
				price: "$24.99",
				quantity: 1,
				image: "/clear-phone-case.jpg",
			},
			{
				name: "USB-C Cable",
				price: "$12.99",
				quantity: 1,
				image: "/usb-c-cable.jpg",
			},
		],
		shipping: "Free",
		estimatedDelivery: "December 18-20, 2024",
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
							Order #{orderDetails.orderNumber}
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
								{orderDetails.items.map((item, index) => (
									<div
										key={index}
										className="flex items-center gap-4 p-4 rounded-lg bg-muted/30"
									>
										<img
											src={item.image || "/placeholder.svg"}
											alt={item.name}
											className="h-16 w-16 rounded-md object-cover"
										/>
										<div className="flex-1">
											<h3 className="font-medium text-foreground">
												{item.name}
											</h3>
											<p className="text-sm text-muted-foreground">
												Quantity: {item.quantity}
											</p>
										</div>
										<div className="text-right">
											<p className="font-semibold text-foreground">
												{item.price}
											</p>
										</div>
									</div>
								))}
							</div>

							<Separator />

							{/* Order Totals */}
							<div className="space-y-2">
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground">Subtotal</span>
									<span className="text-foreground">$127.97</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground">Shipping</span>
									<span className="text-accent font-medium">
										{orderDetails.shipping}
									</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground">Tax</span>
									<span className="text-foreground">$0.01</span>
								</div>
								<Separator />
								<div className="flex justify-between text-lg font-bold">
									<span className="text-foreground">Total</span>
									<span className="text-primary">{orderDetails.total}</span>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Next Steps */}
					<div className="grid md:grid-cols-2 gap-6">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Mail className="h-5 w-5" />
									What's Next?
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
											You'll receive an email confirmation shortly with your
											receipt and tracking information.
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
										<p className="font-medium text-foreground">
											Estimated Delivery
										</p>
										<p className="text-sm text-muted-foreground">
											{orderDetails.estimatedDelivery}
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
									Once your order ships, you'll receive tracking information to
									monitor your package.
								</p>
								<Button className="w-full" size="lg">
									View Order Details
								</Button>
								<Button variant="outline" className="w-full bg-transparent">
									Continue Shopping
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
										Free shipping on orders over $50. Most orders arrive within
										3-5 days.
									</p>
								</div>
								<div className="flex flex-col items-center gap-2">
									<Star className="h-8 w-8 text-primary" />
									<h3 className="font-semibold text-foreground">
										Customer Satisfaction
									</h3>
									<p className="text-sm text-muted-foreground">
										30-day return policy. We're here to help with any questions.
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
