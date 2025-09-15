"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart, Package, ArrowLeft, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function EmptyCart() {
	const suggestedCategories = [
		{
			name: "Office Furniture",
			href: "/products?category=furniture",
			icon: "🪑",
		},
		{
			name: "Office Supplies",
			href: "/products?category=supplies",
			icon: "📝",
		},
		{
			name: "Technology Equipment",
			href: "/products?category=technology",
			icon: "💻",
		},
		{
			name: "Industrial Equipment",
			href: "/products?category=industrial",
			icon: "🏭",
		},
	]

	return (
		<div className="max-w-2xl mx-auto">
			<Card className="shadow-sm">
				<CardContent className="py-16">
					<div className="text-center space-y-6">
						{/* Empty Cart Icon */}
						<div className="relative mx-auto w-32 h-32">
							<div className="absolute inset-0 bg-muted/30 rounded-full flex items-center justify-center">
								<ShoppingCart className="h-16 w-16 text-muted-foreground" />
							</div>
							<div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
								<Sparkles className="h-4 w-4 text-yellow-600" />
							</div>
						</div>

						{/* Empty State Content */}
						<div className="space-y-3">
							<h2 className="text-2xl font-semibold">Your cart is empty</h2>
							<p className="text-muted-foreground max-w-md mx-auto">
								Explore our high-quality products for your business. We have
								thousands of products at the best market prices.
							</p>
						</div>

						{/* Action Buttons */}
						<div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
							<Button size="lg" asChild className="min-w-[160px]">
								<Link href="/products">
									<Package className="h-4 w-4 mr-2" />
									Browse Products
								</Link>
							</Button>

							<Button
								variant="outline"
								size="lg"
								asChild
								className="min-w-[160px]"
							>
								<Link href="/">
									<ArrowLeft className="h-4 w-4 mr-2" />
									Back to Home
								</Link>
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Suggested Categories */}
			<div className="mt-12">
				<h3 className="text-lg font-semibold text-center mb-6">
					Popular Categories
				</h3>
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
					{suggestedCategories.map((category) => (
						<Link key={category.name} href={category.href}>
							<Card className="hover:shadow-md transition-shadow cursor-pointer group h-full">
								<CardContent className="p-6 text-center space-y-3">
									<div className="text-3xl">{category.icon}</div>
									<h4 className="font-medium text-sm group-hover:text-primary transition-colors">
										{category.name}
									</h4>
								</CardContent>
							</Card>
						</Link>
					))}
				</div>
			</div>

			{/* Benefits Section */}
			<Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
				<CardContent className="p-6">
					<div className="text-center space-y-4">
						<h3 className="text-lg font-semibold text-blue-900">
							Why Choose ShopNexus?
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
							<div className="space-y-2">
								<div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
									🚚
								</div>
								<h4 className="font-medium text-blue-900">Fast Delivery</h4>
								<p className="text-blue-700">
									Free shipping on orders over 42 USDT
								</p>
							</div>

							<div className="space-y-2">
								<div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
									💰
								</div>
								<h4 className="font-medium text-blue-900">Best Prices</h4>
								<p className="text-blue-700">
									Special discounts for bulk orders
								</p>
							</div>

							<div className="space-y-2">
								<div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
									🛡️
								</div>
								<h4 className="font-medium text-blue-900">Reliable Warranty</h4>
								<p className="text-blue-700">Official support and warranty</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
