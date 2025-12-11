"use client"

import { HeroSection } from "./components/hero-section"
import { FeaturedCategories } from "./components/featured-categories"
import { ProductGrid } from "@/components/product/product-grid"
import { useListProductCardsRecommended } from "@/core/catalog/product.customer"
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll"
import { useGetMe } from "@/core/account/account"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
	Package,
	ShoppingBag,
	Heart,
	Clock,
	Truck,
	Star,
	ArrowRight,
	TrendingUp,
	History,
	BarChart3,
} from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default function HomePage() {
	const { data: account } = useGetMe()
	const isLoggedIn = !!account
	if (account?.type === "Vendor") {
		redirect("/vendor/products")
	}

	const infiniteProductCards = useListProductCardsRecommended({
		limit: 8,
	})
	const { ref, items: products } = useInfiniteScroll(infiniteProductCards)

	return (
		<div className="min-h-screen flex flex-col">
			<main className="flex-1 mx-auto gap-y-16">
				{/* Personalized Welcome Section for Logged In Users */}
				{!isLoggedIn && <HeroSection />}

				{/* Featured Products */}
				<section className="py-6">
					<div className="container">
						<div className="text-center space-y-4 mb-12">
							<h2 className="text-3xl font-bold text-balance">
								{isLoggedIn
									? account?.type === "Customer"
										? "Recommended for You"
										: "Top Performing Products"
									: "Trending Now"}
							</h2>
							<p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
								{isLoggedIn
									? account?.type === "Customer"
										? "Discover products tailored to your business needs and preferences."
										: "See which products are performing best in your catalog."
									: "Shop our most popular items loved by thousands of customers. Free shipping on orders over $50!"}
							</p>
						</div>
						<div className="sm:px-16 lg:px-32 xl:px-48">
							<ProductGrid products={products} />
							<div ref={ref} />
						</div>

						{/* Additional CTA for logged in users */}
						{isLoggedIn && (
							<div className="text-center mt-12">
								<Button asChild size="lg" variant="outline" className="mr-4">
									<Link href="/search">
										Explore More Products
										<ArrowRight className="ml-2 h-5 w-5" />
									</Link>
								</Button>
								{account?.type === "Customer" && (
									<Button asChild size="lg">
										<Link href="/bulk-orders">Request Bulk Quote</Link>
									</Button>
								)}
							</div>
						)}
					</div>
				</section>

				<FeaturedCategories />

				{/* Why Choose Us / Account Benefits */}
				<section className="py-16 bg-muted/50">
					<div className="container">
						<div className="text-center space-y-4 mb-12">
							<h2 className="text-3xl font-bold text-balance">
								{isLoggedIn
									? account?.type === "Customer"
										? "Your Account Benefits"
										: "Vendor Advantages"
									: "Why Shop With Us?"}
							</h2>
							<p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
								{isLoggedIn
									? account?.type === "Customer"
										? "Take advantage of exclusive features and benefits available to your account."
										: "Maximize your business potential with our vendor tools and support."
									: "We're committed to providing you with the best shopping experience"}
							</p>
						</div>
						<div className="grid gap-8 md:grid-cols-3">
							{isLoggedIn ? (
								account?.type === "Customer" ? (
									<>
										<div className="text-center space-y-4">
											<div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
												<Truck className="w-8 h-8 text-primary" />
											</div>
											<h3 className="text-xl font-semibold">
												Priority Shipping
											</h3>
											<p className="text-muted-foreground">
												Enjoy faster delivery times and priority handling for
												your business orders.
											</p>
										</div>
										<div className="text-center space-y-4">
											<div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
												<TrendingUp className="w-8 h-8 text-primary" />
											</div>
											<h3 className="text-xl font-semibold">
												Volume Discounts
											</h3>
											<p className="text-muted-foreground">
												Access exclusive bulk pricing and volume discounts for
												your business needs.
											</p>
										</div>
										<div className="text-center space-y-4">
											<div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
												<Star className="w-8 h-8 text-primary" />
											</div>
											<h3 className="text-xl font-semibold">
												Dedicated Support
											</h3>
											<p className="text-muted-foreground">
												Get personalized assistance from our business account
												managers.
											</p>
										</div>
									</>
								) : (
									<>
										<div className="text-center space-y-4">
											<div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
												<BarChart3 className="w-8 h-8 text-primary" />
											</div>
											<h3 className="text-xl font-semibold">
												Analytics Dashboard
											</h3>
											<p className="text-muted-foreground">
												Track your sales performance and product analytics in
												real-time.
											</p>
										</div>
										<div className="text-center space-y-4">
											<div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
												<Package className="w-8 h-8 text-primary" />
											</div>
											<h3 className="text-xl font-semibold">
												Easy Product Management
											</h3>
											<p className="text-muted-foreground">
												Manage your inventory, pricing, and product listings
												with our intuitive tools.
											</p>
										</div>
										<div className="text-center space-y-4">
											<div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
												<TrendingUp className="w-8 h-8 text-primary" />
											</div>
											<h3 className="text-xl font-semibold">Growth Support</h3>
											<p className="text-muted-foreground">
												Get marketing support and business growth tools to
												expand your reach.
											</p>
										</div>
									</>
								)
							) : (
								<>
									<div className="text-center space-y-4">
										<div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
											<Truck className="w-8 h-8 text-primary" />
										</div>
										<h3 className="text-xl font-semibold">
											Fast & Free Shipping
										</h3>
										<p className="text-muted-foreground">
											Free shipping on orders over $50. Express delivery
											available.
										</p>
									</div>
									<div className="text-center space-y-4">
										<div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
											<Star className="w-8 h-8 text-primary" />
										</div>
										<h3 className="text-xl font-semibold">
											Quality Guaranteed
										</h3>
										<p className="text-muted-foreground">
											30-day money-back guarantee on all products. Shop with
											confidence.
										</p>
									</div>
									<div className="text-center space-y-4">
										<div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
											<Clock className="w-8 h-8 text-primary" />
										</div>
										<h3 className="text-xl font-semibold">24/7 Support</h3>
										<p className="text-muted-foreground">
											Our customer service team is here to help you anytime,
											anywhere.
										</p>
									</div>
								</>
							)}
						</div>
					</div>
				</section>
			</main>
		</div>
	)
}
