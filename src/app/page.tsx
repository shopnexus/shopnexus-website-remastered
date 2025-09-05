import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/home/hero-section"
import { FeaturedCategories } from "@/components/home/featured-categories"
import { ProductGrid } from "@/components/products/product-grid"

export default function HomePage() {
	return (
		<div className="min-h-screen flex flex-col">
			<Header />

			<main className="flex-1 mx-auto">
				<HeroSection />
				<FeaturedCategories />

				{/* Featured Products */}
				<section className="py-16">
					<div className="container">
						<div className="text-center space-y-4 mb-12">
							<h2 className="text-3xl font-bold text-balance">Trending Now</h2>
							<p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
								Shop our most popular items loved by thousands of customers.
								Free shipping on orders over $50!
							</p>
						</div>
						<ProductGrid />
					</div>
				</section>

				{/* Why Choose Us */}
				<section className="py-16 bg-muted/50">
					<div className="container">
						<div className="text-center space-y-4 mb-12">
							<h2 className="text-3xl font-bold text-balance">
								Why Shop With Us?
							</h2>
							<p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
								We're committed to providing you with the best shopping
								experience
							</p>
						</div>
						<div className="grid gap-8 md:grid-cols-3">
							<div className="text-center space-y-4">
								<div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
									<svg
										className="w-8 h-8 text-primary"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
										/>
									</svg>
								</div>
								<h3 className="text-xl font-semibold">Fast & Free Shipping</h3>
								<p className="text-muted-foreground">
									Free shipping on orders over $50. Express delivery available.
								</p>
							</div>
							<div className="text-center space-y-4">
								<div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
									<svg
										className="w-8 h-8 text-primary"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
								</div>
								<h3 className="text-xl font-semibold">Quality Guaranteed</h3>
								<p className="text-muted-foreground">
									30-day money-back guarantee on all products. Shop with
									confidence.
								</p>
							</div>
							<div className="text-center space-y-4">
								<div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
									<svg
										className="w-8 h-8 text-primary"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z"
										/>
									</svg>
								</div>
								<h3 className="text-xl font-semibold">24/7 Support</h3>
								<p className="text-muted-foreground">
									Our customer service team is here to help you anytime,
									anywhere.
								</p>
							</div>
						</div>
					</div>
				</section>
			</main>

			<Footer />
		</div>
	)
}
