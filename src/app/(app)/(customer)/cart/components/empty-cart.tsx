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
								<Link href="/search">
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
		</div>
	)
}
