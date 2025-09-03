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
							<h2 className="text-3xl font-bold text-balance">
								Featured Products
							</h2>
							<p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
								Discover our most popular business solutions with competitive
								pricing and bulk discounts
							</p>
						</div>
						<ProductGrid />
					</div>
				</section>
			</main>

			<Footer />
		</div>
	)
}
